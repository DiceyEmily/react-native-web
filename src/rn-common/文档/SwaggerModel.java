package com.xixian.office.opinion.config;

import com.fasterxml.classmate.ResolvedType;
import com.fasterxml.classmate.TypeBindings;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.annotations.ApiModelProperty;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.core.annotation.Order;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import springfox.documentation.service.ResolvedMethodParameter;
import springfox.documentation.spi.DocumentationType;
import springfox.documentation.spi.service.OperationBuilderPlugin;
import springfox.documentation.spi.service.contexts.OperationContext;
import tech.jhipster.config.JHipsterConstants;
import tech.jhipster.service.filter.*;

import javax.validation.constraints.NotNull;
import java.io.File;
import java.io.FileOutputStream;
import java.lang.reflect.*;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZonedDateTime;
import java.util.*;

/**
 * 生成TypeScript代码
 */
class GenCode {
    /**
     * 排除以此url开头的接口
     */
    static final HashSet<String> excludeUrl = new HashSet<String>() {
        {
            add("/management/");
        }
    };

    static final HashSet<String> excludeName = new HashSet<>() {
        {
            add("com_xixian_office_common");
            add("com_xixian_feign_service");
            add("com_xixian_office_opinion_service_feign");
            add("com_xixian_office_task_repository_OfficeFeignStarService");
        }
    };

    /**
     * 首部imports列表
     */
    HashSet<String> imports = new HashSet<String>();


    public String onClass(Class<?> cls, String cont, String className, String extend) {
        String ret = "";
        if (extend != null && extend.length() > 0) {
            extend = " extends " + extend;
        }

        for (String v : imports) {
            ret += v;
        }

//        imports.clear();
        return ret + "\r\n" +
            "export class " + className + extend + " {\r\n" +
            "\r\n" + cont + "\r\n" +
//            "    constructor(\r\n" + cont +
//            "    ) {\r\n" +
//            "    }\r\n" +
            "    /////////////////自定义代码区///////////////////////\r\n" +
            "}\r\n\r\n /////////////////自定义结束///////////////////////\r\n";
    }

    public String onEnum(Class<?> cls, String cont, String className) {
        String ret = "";
        for (String v : imports) {
            ret += v;
        }
//        imports.clear();
        return ret + "\r\n" +
            "export const " + className + " = {\r\n" +
            "\r\n" + cont + "\r\n" +
//            "    constructor(\r\n" + cont +
//            "    ) {\r\n" +
//            "    }\r\n" +
            "    /////////////////自定义代码区///////////////////////\r\n" +
            "}\r\n\r\n /////////////////自定义结束///////////////////////\r\n\r\n" +
            "export type " + className + "Type = keyof typeof " + className + "\r\n";
    }

    public String getFieldComment(Field f) {
        var anno = f.getAnnotation(ApiModelProperty.class);
        boolean notNull = f.getAnnotation(NotNull.class) != null;
        if (anno == null && !notNull) {
            return "";
        }


        String ret = "    /**";

        if (notNull) {
            ret += "\r\n    * 必填 NotNull";
        }

        if (anno != null && StringUtils.hasText(anno.value())) {
            ret += "\r\n    * " + anno.value();
        }
        if (anno != null && StringUtils.hasText(anno.notes())) {
            ret += "\r\n    * " + anno.notes();
        }
        if (anno != null && StringUtils.hasText(anno.example())) {
            ret += "\r\n    * " + anno.example();
        }
        return ret + "\r\n    */\r\n";
    }

    public String onClassField(Field f, String type, String defVal, Boolean option) {
        if (f != null) {
            String ret = getFieldComment(f) + "    public " + getFieldName(f);
            if (option) {
                if (defVal.length() > 0)
                    return ret + "?= " + defVal + " \r\n\r\n";
                else
                    return ret + "?: " + type + " \r\n\r\n";
            }
            return ret + " = " + defVal + " \r\n\r\n";
        }
        return type;
    }

    public String onClassField(Field f, String type, String defVal) {
        return onClassField(f, type, defVal, false);
    }

    //基础类型参数
    String paraBaseType = "";
    //class类型参数
    String paraClassType = "";
    //url参数
    String paraUrlPath = "";
    //参数名
    String paraName = "";

    //非get请求中的url参数
    String paraNoGetUrl = "";


    public void onParaInit() {
        paraNoGetUrl = "";
        paraUrlPath = "";
        paraName = "";
        paraClassType = "";
        paraBaseType = "";
    }

    public void onParas(OperationContext context, String name, String val, boolean isPath, boolean isUrl) {
        //paraName = name;
        name = name.replaceAll("-", "_");
        if (isPath) {
            paraUrlPath += name + ": " + val + ", ";
            return;
        }

        if (context.httpMethod() != HttpMethod.GET && context.httpMethod() != HttpMethod.DELETE) {
            if (isUrl) {
                paraNoGetUrl += name + ": " + val + ", ";
                return;
            }
        }

        paraName = "paras";

        boolean isBase = isBaseType(val);
//         || context.httpMethod() != HttpMethod.GET
        if ((context.httpMethod() == HttpMethod.GET || context.httpMethod() == HttpMethod.DELETE) && isBase) {
            paraBaseType += name + "?: " + val + ", ";
            return;
        }

        if (paraClassType.length() > 0) {
            paraClassType += " & ";
        }

        if (context.httpMethod() == HttpMethod.GET || context.httpMethod() == HttpMethod.PATCH || context.httpMethod() == HttpMethod.DELETE) {
            paraClassType += "Partial<" + val + ">";
        } else {
            paraClassType += val;
        }

    }


    public String onApiFile(String cont) {
        String ret = "import { ApiRequestBase } from \"../../config/apiBase\";\r\n";
        for (String v : imports) {
            ret += v;
        }
//        imports.clear();
        return ret + "\r\n" +
            "\r\n" +
            "/**\r\n" +
            " * http接口请求\r\n" +
            " */\r\n" +
            "class ApiRequest extends ApiRequestBase {\n" + cont + "\r\n/////////////////自定义代码区///////////////////////\r\n} \r\n" +
            "\r\n" +
            "\r\n/////////////////自定义结束///////////////////////" +
            "\r\n";
    }

    public String onApi(String name, OperationContext context, String ret, String comment) {

        String urlReplace = "${";
        String url = context.requestMappingPattern().replace("{", urlReplace);

        String method = ".usePOST";
        if (context.httpMethod() == HttpMethod.GET) {
            method = ".useGET";
        }
        if (context.httpMethod() == HttpMethod.PUT) {
            method = ".usePUT";
        }
        if (context.httpMethod() == HttpMethod.PATCH) {
            method = ".usePATCH";
        }
        if (context.httpMethod() == HttpMethod.DELETE) {
            method = ".useDELETE";
        }
        String paras = "";

        if (paraNoGetUrl.length() > 0) {
            paras += "gets: {\r\n" +
                "        " + paraNoGetUrl +
                "\r\n    }, ";
        }

        if (paraUrlPath.length() > 0) {
            paras += paraUrlPath;
        }
        if (paraName.length() > 0) {
            paras += paraName + ": ";
        }
        if (paraBaseType.length() > 0) {
            paras += "{\r\n        " + paraBaseType + "\r\n    }";
        }

        if (paraClassType.length() > 0) {
            if (paraBaseType.length() > 0) {
                paras += " & ";
            }
            paras += paraClassType;
        }

        String cont = "\r\n" + comment + "\r\n    " + name + "(" + paras + ") {\r\n" +
            "        let req = this.request(`" + url + "`, " + ret + ")";
        if (paraNoGetUrl.length() > 0) {
            cont += ".setUrlPara(gets)";
        }
        if (paraName.length() > 0) {
            cont += ".setPara(" + paraName + ")";
        }

        return cont + method +
            "\r\n        return req;\r\n" +
            "    }\r\n\r\n";
    }

    public boolean isBaseType(String type) {
        return onInt().equals(type) || onLong().equals(type) || onFloat().equals(type) || onDouble().equals(type)
            || onBool().equals(type) || onString().equals(type);
    }

    public String onFilter() {
        return "FilterJhipster";
    }

    public String onFilterVal(String val) {
        imports.add("import { filter } from \"../JHipsterFilter\";\r\n");
        return "filter.equals(" + val + ")";
    }

    public String onAny() {
        return "any";
    }

    public String onAnyVal() {
        return "{} as any";
    }

    public String onInt() {
        return "number";
    }


    public String onIntVal() {
        return "0";
    }

    public String onLong() {
        return "number";
    }

    public String onLongVal() {
        return "0";
    }

    public String onFloat() {
        return "number";
    }

    public String onFloatVal() {
        return "0";
    }

    public String onDouble() {
        return "number";
    }

    public String onDoubleVal() {
        return "0";
    }

    public String onBool() {
        return "boolean";
    }

    public String onBoolVal() {
        return "false";
    }

    public String onString() {
        return "string";
    }

    public String onStringVal() {
        return "''";
    }

    public String onVoid() {
        return "void";
    }

    public String onVoidVal() {
        return "null";
    }


    public String onArray(String type) {
        return "Array<" + type + ">";
    }

    public String onArrayVal(String val, boolean isEnum) {

        if (val.equals("any") || val.equals("{} as any")) {
            return "Array<any>()";
        }

        if (val.equals("boolean") || val.equals("false")) {
            imports.add("import { arrayBool } from \"@common/lib/lib\";\r\n");
            return "arrayBool()";
        }

        if (val.equals("number") || val.equals("0")) {
            imports.add("import { arrayNumber } from \"@common/lib/lib\";\r\n");
            return "arrayNumber()";
        }
        if (val.equals("string") || val.equals("''")) {
            imports.add("import { arrayString } from \"@common/lib/lib\";\r\n");
            return "arrayString()";
        }

        imports.add("import { array } from \"@common/lib/lib\";\r\n");

        if (isEnum) {
            return "Array<" + val + ">()";
        }

        return "array(" + val + ")";
    }

    public String onEnumType(String name, String menu, String val) {
        imports.add("import { " + name + "Type } from \"" + menu + name + "\";\r\n");
        if (val != null) {
            return "null as " + name + "Type | null";
            //return "'" + val + "' as " + name + "Type";
        }
        return name + "Type";
    }

    public String onClassVal(String name, String menu) {
        imports.add("import { " + name + " } from \"" + menu + name + "\";\r\n");

        return "new " + name + "()";
    }

    public String onEnumVal(String name, String menu) {
        imports.add("import { " + name + " } from \"" + menu + name + "\";\r\n");

        return "new " + name + "()";
    }

    public String getMenu() {
        return SwaggerModel.outMenu + "ts/";
    }

    public String getExt() {
        return ".ts";
    }


    public String getFieldName(Field f) {

        JsonProperty jsonName = f.getAnnotation(JsonProperty.class);
        if (jsonName != null) {
            return jsonName.value();
        }
        return f.getName();
    }

}

/**
 * 生成kotlin代码
 */
class GenCodeKotlin extends GenCode {

    @Override
    public String onAny() {
        return "Any";
    }

    @Override
    public String onInt() {
        return "Int";
    }

    @Override
    public String onLong() {
        return "Long";
    }

    @Override
    public String onFloat() {
        return "Float";
    }

    @Override
    public String onDouble() {
        return "Double";
    }

    @Override
    public String onArray(String type) {
        return "ArrayList<" + type + ">";
    }
}

class PageModel {
    int page = 0;
    int size = 0;
    String sort = "";
}

@Profile(JHipsterConstants.SPRING_PROFILE_DEVELOPMENT)
@Configuration
@Order(-19999)
public class SwaggerModel implements OperationBuilderPlugin {

    SwaggerModel() {
        try {
            new File(outMenu + "/ts").delete();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    /**
     * 用于处理class重名<类名，包名>
     */
    public static HashMap<String, String> classNames = new HashMap<>();

    private final Logger log = LoggerFactory.getLogger(SwaggerModel.class);

    /**
     * 输出目录
     */
    public static final String outMenu = System.getProperty("user.dir") + "/target/";

    Timer timer = null;

    /**
     * 获取类型名
     *
     * @param retType
     * @param gen
     * @param val
     * @return
     */
    String getTypeStr(ResolvedType retType, GenCode gen, boolean val) {


        Class<?> cls = retType.getErasedType();

        if (cls.equals(byte[].class)) {
            if (val) {
                return gen.onAnyVal();
            }
            return gen.onAny();
        }

        if (cls.equals(String[].class)) {
            if (val) {
                return gen.onArrayVal("string", false);
            }
            return gen.onArray("string");
        }

        if (cls.equals(Integer[].class) || cls.equals(Float[].class) || cls.equals(Double[].class)) {
            if (val) {
                return gen.onArrayVal("number", false);
            }
            return gen.onArray("number");
        }


        if (cls.equals(Optional.class) || cls.equals(ResponseEntity.class)) {
            TypeBindings bindType = retType.getTypeBindings();
            if (bindType.size() > 0) {
                ResolvedType bindT1 = bindType.getBoundType(0);
                return getTypeStr(bindT1, gen, val);
            }

            if (val) {
                return gen.onAnyVal();
            }
            return gen.onAny();
        }

        if (cls.equals(List.class) || cls.equals(Array.class) || cls.equals(ArrayList.class)
            || cls.equals(HashSet.class)
            || cls.equals(Set.class)) {
            TypeBindings bindType = retType.getTypeBindings();
            if (bindType.size() > 0) {
                ResolvedType bindT1 = bindType.getBoundType(0);

                if (val) {
                    boolean isEnum = false;
                    if (bindT1 != null && bindT1.getErasedType().isEnum()) {
                        isEnum = true;
                    }

                    return gen.onArrayVal(getTypeStr(bindT1, gen, val), isEnum);
                }
                return gen.onArray(getTypeStr(bindT1, gen, val));
            }

            if (val) {
                gen.onArrayVal(gen.onAny(), false);
            }
            return gen.onArray(gen.onAny());
        }

        if (cls.equals(Map.class) || cls.equals(HashMap.class)) {
            if (val) {
                return gen.onAnyVal();
            }
            return gen.onAny();
        }

        if (cls.equals(ZonedDateTime.class) || cls.equals(LocalDate.class) || cls.equals(LocalDateTime.class)) {
            if (val) {
                return gen.onStringVal();
            }
            return gen.onString();
        }

        if (cls.equals(UUID.class)) {
            if (val) {
                return gen.onStringVal();
            }
            return gen.onString();
        }


        if (cls.equals(StringFilter.class) || cls.equals(UUIDFilter.class) || cls.equals(BooleanFilter.class) || cls.equals(IntegerFilter.class)
            || cls.equals(FloatFilter.class) || cls.equals(ZonedDateTimeFilter.class)
            || cls.equals(InstantFilter.class)
            || cls.equals(LocalDateFilter.class)
            || cls.equals(LongFilter.class)
            || Filter.class.equals(cls.getSuperclass())
        ) {
            if (val) {
                return gen.onFilterVal("''");
            }
            return gen.onFilter();
        }

        if (cls.isEnum()) {
            return getEnumInfo(cls, gen, val);
        }

        if (cls.equals(Object.class) || cls.getSimpleName().equals("JSONObject")) {
            if (val) {
                return gen.onAnyVal();
            }
            return gen.onAny();
        }

        if (cls.equals(Integer.class) || cls.equals(int.class)) {
            if (val) {
                return gen.onIntVal();
            }
            return gen.onInt();
        }


        if (cls.equals(void.class) || cls.equals(Void.class)) {
            if (val) {
                return gen.onVoidVal();
            }
            return gen.onVoid();
        }

        if (cls.equals(Long.class) || cls.equals(long.class)) {
            if (val) {
                return gen.onLongVal();
            }
            return gen.onLong();
        }

        if (cls.equals(Instant.class)) {
            if (val) {
                return gen.onStringVal();
            }
            return gen.onString();
        }


        if (cls.equals(float.class) || cls.equals(Float.class)) {
            if (val) {
                return gen.onFloatVal();
            }
            return gen.onFloat();
        }

        if (cls.equals(double.class) || cls.equals(Double.class)) {
            if (val) {
                return gen.onDoubleVal();
            }
            return gen.onDouble();
        }

        if (cls.equals(String.class)) {
            if (val) {
                return gen.onStringVal();
            }
            return gen.onString();
        }

        if (cls.equals(Date.class)) {
            if (val) {
                return gen.onStringVal();
            }
            return gen.onString();
        }

        if (cls.equals(Boolean.class) || cls.equals(boolean.class)) {
            if (val) {
                return gen.onBoolVal();
            }
            return gen.onBool();
        }

        if (cls.getName().equals("org.springframework.data.domain.Pageable")) {
            cls = PageModel.class;
            gen.onClassVal("PageModel", "../");
            return "PageModel";
        }


        TypeBindings bindType = retType.getTypeBindings();


        if (bindType.size() == 1) {//泛型code data返回类型
            var fields = retType.getMemberFields();
            int isResult = 0;
            for (var f : fields) {
                var name = f.getName();
                if (name.equals("code") || name.equals("data") || name.equals("exchangeStatus")) {
                    isResult++;
                }
            }
            if (isResult >= 2) {
                ResolvedType bindT1 = bindType.getBoundType(0);
                return getTypeStr(bindT1, gen, val);
            }
        }
//            Field[] fs = cls.getDeclaredFields();
//            String tt = fs[0].getGenericType().getTypeName();
//            String tt2 = fs[1].getGenericType().getTypeName();
//            String tt3=bindType.getBoundName(0);


        //class
        getClassInfo(cls, gen, bindType);


        return getClassName(cls, bindType);
    }

    static String getClassName(Class<?> cls) {
        return getClassName(cls, null);
    }

    /**
     * 处理class名重复
     *
     * @param cls
     * @return
     */
    static String getClassName(Class<?> cls, TypeBindings bindType) {
        String ret = cls.getSimpleName();

        if (bindType != null && bindType.size() > 0) {//带上泛型类型名
            for (int i = 0; i < bindType.size(); i++) {
                ResolvedType res = bindType.getBoundType(i);
                ret += res.getErasedType().getSimpleName();
            }
        }

        if (ret.equals("Document")) {
            ret = "DocumentModel";
        }

        String pack = classNames.get(ret);


        if (pack != null && !pack.equals(cls.getName())) {
            ret = ret + Math.abs(cls.getName().hashCode());
        }
        classNames.put(ret, cls.getName());
        return ret;
    }


    HashSet<String> hasWrite = new HashSet<String>();


    ResolvedType findGenericType(TypeBindings bindType, String name) {

        if (bindType == null) {
            return null;
        }
        for (int i = 0; i < bindType.size(); i++) {
            if (bindType.getBoundName(i).equals(name)) {
                return bindType.getBoundType(i);
            }
        }
        return null;
    }

    String getPageFlowInfo(String name, TypeBindings bindType, GenCode newGen) {
        if (bindType == null || bindType.size() < 1) {
            return "";
        }
        ResolvedType cont = bindType.getBoundType(0);

        return "\n" +
            "    records = " + newGen.onArrayVal(getTypeStr(cont, newGen, false), false) + ";\n" +
            "\n" +
            "    total = 0;\n" +
            "\n" +
            "    size = 0;\n" +
            "\n" +
            "    current = 0;\n" +
            "\n" +
            "    offset = 0;\n" +
            "\n" +
            "\n";

    }

    String getPageInfo(String name, TypeBindings bindType, GenCode newGen) {
        if (bindType == null || bindType.size() < 1) {
            return "";
        }
        newGen.onClassVal("Pageable", "../");
        newGen.onClassVal("Sort", "../");

        ResolvedType cont = bindType.getBoundType(0);


        return "\n" +
            "    content = " + newGen.onArrayVal(getTypeStr(cont, newGen, false), false) + ";\n" +
            "\n" +
            "    pageable = new Pageable();\n" +
            "\n" +
            "    last = false;\n" +
            "\n" +
            "    totalPages = 0;\n" +
            "\n" +
            "    totalElements = 0;\n" +
            "\n" +
            "    size = 0;\n" +
            "\n" +
            "    number = 0;\n" +
            "\n" +
            "    sort = new Sort();\n" +
            "\n" +
            "    first = false;\n" +
            "\n" +
            "    numberOfElements = 0;\n" +
            "\n" +
            "    empty = false;\n" +
            "\n";

    }


    String getEnumInfo(Class<?> enu, GenCode gen, boolean val) {

        String clasName = SwaggerModel.getClassName(enu, null);

        String enuVal = "";
        Object[] inst = enu.getEnumConstants();
        if (inst.length > 0) {
            enuVal = inst[0] + "";
        }

        if (hasWrite.contains(clasName)) {
            return gen.onEnumType(clasName, "./", val ? enuVal : null);
        }
        hasWrite.add(clasName);


        String info = "";
        ArrayList<Field> fields = new ArrayList<>(Arrays.asList(enu.getDeclaredFields()));


        try {
            GenCode newGen = gen.getClass().newInstance();

            for (Object obj : inst) {
                String name = obj + "";
                info += "    " + name + ": {\r\n";

                for (Field ff : fields) {
                    if (ff.getType().equals(enu) || (ff.getModifiers() & Modifier.STATIC) != 0) {
                        continue;
                    }

                    ff.setAccessible(true);
                    Object v2 = ff.get(obj);
                    String vv = v2 instanceof String ? "'" + v2 + "'" : v2 + "";
                    info += "        " + ff.getName() + ": " + vv + ",\r\n";

                }
                info += "    },\r\n";
            }

            writeFile(newGen.onEnum(enu, info, clasName), newGen.getMenu() + clasName + newGen.getExt());
        } catch (Exception e) {
            log.error("newInstance error:" + e);
        }

        return gen.onEnumType(clasName, "./", val ? enuVal : null);
    }

    /**
     * 生成Class 并返回其实例
     *
     * @param clas
     * @param gen
     * @return
     */
    String getClassInfo(Class<?> clas, GenCode gen, TypeBindings bindType) {
        String info = "";
        ArrayList<Field> fields = new ArrayList<>(Arrays.asList(clas.getDeclaredFields()));


        String extend = "";


        String clasName = SwaggerModel.getClassName(clas, bindType);

        if (hasWrite.contains(clasName)) {
            return gen.onClassVal(clasName, "./");
        }
        hasWrite.add(clasName);


        try {
            GenCode newGen = gen.getClass().newInstance();

            Class<?> superClas = clas.getSuperclass();
            //生成父类
            if (superClas != null && !superClas.equals(Object.class)) {
                extend = SwaggerModel.getClassName(superClas, null);
                newGen.onClassVal(extend, "./");
                getClassInfo(superClas, newGen, null);
            }

            if (clas.getName().equals("com.baomidou.mybatisplus.core.metadata.IPage")) {
                info += getPageFlowInfo(clasName, bindType, newGen);
            }

            if (clas.equals(Page.class)) {


                info += getPageInfo(clasName, bindType, newGen);
            }

            for (Field f : fields) {
                if (Modifier.isStatic(f.getModifiers()))
                    continue;

                if (Modifier.isFinal(f.getModifiers()))
                    continue;

                JsonIgnore ignor = f.getAnnotation(JsonIgnore.class);
                if (ignor != null)
                    continue;

                Class<?> cls = f.getType();


                if (cls.equals(Object.class)) {
                    String name = f.getGenericType().getTypeName();
                    ResolvedType genericType = findGenericType(bindType, name);
                    if (genericType != null) {
                        info += getClassField(f, genericType.getErasedType(), null, newGen);
                    } else {
                        info += getClassField(f, cls, null, newGen);
                    }

                } else if (cls.equals(clas)) {
                    info += newGen.onClassField(f, clasName, "", true);
                } else {
                    Type genericType = f.getGenericType();
                    info += getClassField(f, cls, genericType, newGen);
                }

            }


            writeFile(newGen.onClass(clas, info, clasName, extend), newGen.getMenu() + clasName + newGen.getExt());
        } catch (Exception e) {
            e.printStackTrace();
        }


        return gen.onClassVal(clasName, "./");
    }


    /**
     * @param f           为空时表明不关联任何字段，(如List<>中的嵌套类型)
     * @param cls
     * @param genericType
     * @param gen
     * @return field type and value
     */
    String getClassField(Field f, Class<?> cls, Type genericType, GenCode gen) {

        if (cls.isArray()) {
            var subCls = cls.getComponentType();
            String subVal = getClassField(null, subCls, null, gen);
            return gen.onClassField(f, gen.onArrayVal(subVal, subCls.isEnum()), gen.onArrayVal(subVal, subCls.isEnum()));
        }

        if (cls.equals(List.class) || cls.equals(Array.class) || cls.equals(ArrayList.class)
            || cls.equals(HashSet.class)

            || cls.equals(Set.class)) {
            if (genericType instanceof ParameterizedType) {
                Type t0 = ((ParameterizedType) genericType).getActualTypeArguments()[0];
                Class<?> subCls = null;
                try {
                    if (t0 instanceof ParameterizedType) {//嵌套泛型
                        subCls = (Class<?>) ((ParameterizedType) t0).getRawType();
                    } else {
                        subCls = (Class<?>) t0;
                    }
                } catch (Exception e) {
                    subCls = t0.getClass();
                }
                String subVal = getClassField(null, subCls, t0, gen);
                return gen.onClassField(f, gen.onArrayVal(subVal, subCls.isEnum()), gen.onArrayVal(subVal, subCls.isEnum()));
            }
            //未知类型
            return gen.onClassField(f, gen.onArrayVal(gen.onAny(), false), gen.onArrayVal(gen.onAny(), false));
        }

        if (cls.equals(Map.class) || cls.getSimpleName().equals("JSONObject")) {
            return gen.onClassField(f, gen.onAny(), gen.onAnyVal());
        }

        if (cls.equals(Object.class)) {
            return gen.onClassField(f, gen.onAny(), gen.onAnyVal());
        }

        if (cls.equals(Instant.class)) {
            return gen.onClassField(f, gen.onString(), gen.onStringVal());
        }

        if (cls.equals(Integer.class) || cls.equals(int.class)) {
            return gen.onClassField(f, gen.onInt(), gen.onIntVal());
        }

        if (cls.equals(Long.class) || cls.equals(long.class)) {
            return gen.onClassField(f, gen.onLong(), gen.onLongVal());
        }

        if (cls.equals(float.class) || cls.equals(Float.class)) {
            return gen.onClassField(f, gen.onFloat(), gen.onFloatVal());
        }

        if (cls.equals(void.class) || cls.equals(Void.class)) {
            return gen.onClassField(f, gen.onVoid(), gen.onVoid());
        }

        if (cls.equals(double.class) || cls.equals(Double.class)) {
            return gen.onClassField(f, gen.onDouble(), gen.onDoubleVal());
        }

        if (cls.equals(ZonedDateTime.class) || cls.equals(LocalDate.class) || cls.equals(LocalDateTime.class)) {
            return gen.onClassField(f, gen.onString(), gen.onStringVal());
        }

        if (cls.equals(UUID.class)) {
            return gen.onClassField(f, gen.onString(), gen.onStringVal());
        }

        if (cls.isEnum()) {
            String type = getEnumInfo(cls, gen, false);
            String val = getEnumInfo(cls, gen, true);
            return gen.onClassField(f, type, val);
        }

        if (cls.equals(BooleanFilter.class)
        ) {
            return gen.onClassField(f, gen.onFilter(), gen.onFilterVal("false"), true);
        }

        if (cls.equals(IntegerFilter.class)
            || cls.equals(FloatFilter.class) || cls.equals(DoubleFilter.class)
            || cls.equals(LongFilter.class)
        ) {
            return gen.onClassField(f, gen.onFilter(), gen.onFilterVal("0"), true);
        }

        if (cls.equals(StringFilter.class)
            || cls.equals(UUIDFilter.class)
            || cls.equals(ZonedDateTimeFilter.class)
            || cls.equals(InstantFilter.class)
            || cls.equals(LocalDateFilter.class)
        ) {
            return gen.onClassField(f, gen.onFilter(), gen.onFilterVal("''"), true);
        }

        if (Filter.class.equals(cls.getSuperclass())) {
            //枚举类型filter
            Type ret = cls.getGenericSuperclass();
            if (ret instanceof ParameterizedType) {
                Type g = ((ParameterizedType) ret).getActualTypeArguments()[0];
                if (g instanceof Class) {
                    if (((Class<?>) g).isEnum()) {
                        return gen.onClassField(f, gen.onFilter(), gen.onFilterVal(getEnumInfo((Class<?>) g, gen, true)), true);
                    }
                }
            }
            return gen.onClassField(f, gen.onFilter(), gen.onFilterVal("''"), true);
        }

        if (cls.equals(Date.class)) {
            return gen.onClassField(f, gen.onString(), gen.onStringVal(), true);
        }


        if (cls.equals(String.class)) {
            return gen.onClassField(f, gen.onString(), gen.onStringVal());
        }

        if (cls.equals(Boolean.class) || cls.equals(boolean.class)) {
            return gen.onClassField(f, gen.onBool(), gen.onBoolVal());
        }


        if (cls.getName().equals("org.springframework.data.domain.Pageable")) {
            return gen.onClassField(f, PageModel.class.getSimpleName(), getClassInfo(PageModel.class, gen, null));
        }

//        if (f != null) {
//            Type bindT = f.getGenericType();
//            if(bindT instanceof ParameterizedType){//泛型待处理
//
//            }
//            int a = 1;
//        }
        //class
        return gen.onClassField(f, cls.getSimpleName(), getClassInfo(cls, gen, null));
    }

    String apiFileInfo = "";


    GenCode gen = new GenCode();

    /**
     * 访问私有属性
     *
     * @param obj
     * @param field
     * @param <T>
     * @return
     */
    <T> T getPrivateField(Object obj, String field) {
        if (obj == null) {
            return null;
        }
        try {
            Class<?> cls = obj.getClass();
            Field f = cls.getDeclaredField(field);
            f.setAccessible(true);
            return (T) f.get(obj);
        } catch (Exception e) {
            return null;
        }
    }


    HashSet<String> apiNams = new HashSet<>();

    @Override
    public void apply(OperationContext context) {

        if (timer != null) {
            timer.cancel();
        }


        timer = new Timer();
        timer.schedule(new TimerTask() {
            @Override
            public void run() {
                writeFile(gen.onApiFile(apiFileInfo), gen.getMenu() + "api" + gen.getExt());
            }
        }, 500);


        for (String v : GenCode.excludeUrl) {
            if (context.requestMappingPattern().startsWith(v)) {
                return;
            }
        }

        String bean = getPrivateField(getPrivateField(getPrivateField(getPrivateField(context, "requestContext"), "handler"), "handlerMethod"), "bean");
        if (bean != null) {
            bean = bean.replaceAll("\\.", "_");
        }
        if (bean != null) {
            for (String v : GenCode.excludeName) {
                if (bean.startsWith(v)) {
                    return;
                }
            }
        }


        //生成参数
        gen.onParaInit();
        List<ResolvedMethodParameter> paras = context.getParameters();
        for (ResolvedMethodParameter p : paras) {
            if (p.defaultName().isPresent()) {
                String pName = p.defaultName().get();
                String pType = getTypeStr(p.getParameterType(), gen, false);

                Optional<RequestParam> requestAnno = p.findAnnotation(RequestParam.class);
                boolean isUrl = false;
                if (requestAnno.isPresent()) {
                    isUrl = true;
                    if (requestAnno.get().name().length() > 0) {
                        pName = requestAnno.get().name();
                    }
                }


                boolean isPath = false;
                Optional<PathVariable> pathAnno = p.findAnnotation(PathVariable.class);
                if (pathAnno.isPresent()) {
                    isPath = true;
                    if (pathAnno.get().name().length() > 0) {
                        pName = pathAnno.get().name();
                    }
                }

                gen.onParas(context, pName, pType, isPath, isUrl);
            }
        }


        ResolvedType retType = context.getReturnType();

        String retStr = getTypeStr(retType, gen, true);


        String name = bean == null ? context.getName() : context.getName() + "_" + bean;


        if (apiNams.contains(name)) {
            return;
        }
        apiNams.add(name);

        Object summery = getPrivateField(context.operationBuilder(), "summary");
        Object note = getPrivateField(context.operationBuilder(), "notes");

        String comment = "    /**\r\n    * " + summery;
        if (note != null) {
            comment += "\r\n    * " + note;
        }
        comment += "\r\n    */";
        apiFileInfo += gen.onApi(name, context, retStr, comment);

    }

    @Override
    public boolean supports(DocumentationType documentationType) {
        return true;
    }


    void writeFile(String text, String file) {
        try {
            File menu = new File(file);
            menu.getParentFile().mkdirs();
        } catch (Exception e) {
            log.error("mkdir error:" + e);
        }

        File f = new File(file);
        try {
            FileOutputStream fs = new FileOutputStream(f);
            fs.write(text.getBytes(StandardCharsets.UTF_8));
            log.debug("已生成model文件至:" + file);
            fs.close();
        } catch (Exception e) {
            log.error(f + " write error:" + e);
        }
    }
}
