
import { FuncParse } from "@common/lib/FuncParse";
import { TypeJson } from "@common/lib/TypeJson";
import { vali, validArray, validNumber, validString } from "@common/lib/valid";
import { lib } from "../src/rn-common/lib/lib";
import * as fs from "fs"
import { CodeMerge } from "@common/task/CodeMerge";

class TessA {
    a = 1;
    b = () => {

    };
}


class Test1 {

    abc = 1;

    func() {

    }
}

class Test2 {
    abc = 1;

    func = () => {

    }
}


class TestValidSub {

    @validNumber(r => r.min(1))
    a = 0;

}
class TestValidSub2 {

    @validNumber(r => r.requireInt() && r.min(1) && r.max(10))
    b = 10;
}

class TestValidSub3 {

    @validString(r => r.required())
    b = "";
}

class TestValidSub4 {

    @validString(r => r.required("请输入内容"))
    b = "";
}

class TestValidSub5 {

    @validString(r => r.required("请输入内容") && r.min(2, "长度不能少于2"))
    b = "1";
}

class TestValidSub6 {

    @validString(r => r.required("请输入内容") && r.min(2, "长度不能少于2") && r.max(10))
    b = "123";
}

class TestValid {
    @validArray(r => r.required())
    aa = []
}

class TestValid2 {
    @validArray(r => r.required())
    aa = [1]

}

class TestValid3 {
    @validArray(r => r.required())
    aa = [1]

    bb = new TestValidSub6();
}


class TestValid4 {
    @validArray(r => r.required())
    aa = [1]

    bb = new TestValidSub6();

    cc = new TestValidSub5();
}

class TestValid5 {
    @validArray(r => r.required())
    aa = [new TestValidSub6(), new TestValidSub6()]

}

class TestValid6 {
    @validArray(r => r.required())
    aa = [new TestValidSub6(), new TestValidSub5()]

}


test('Lib', async () => {

    let codeLine = ""
    let spaceCount = "";
    CodeMerge.readLine(`class TestValid5 {
    @validArray(r => r.required())
    aa = [new TestValidSub6(), new TestValidSub6()]

}

class TestValid6 {
    @validArray(r => r.required())
    aa = [new TestValidSub6(), new TestValidSub5()]

}
`, (line, space, num) => {
        codeLine += line;
        spaceCount += space;
    })
    expect(codeLine).toEqual("class TestValid5 {@validArray(r => r.required())aa = [new TestValidSub6(), new TestValidSub6()]}class TestValid6 {@validArray(r => r.required())aa = [new TestValidSub6(), new TestValidSub5()]}")
    expect(spaceCount).toEqual("                ");

    // let fstr = fs.readFileSync("./src/model/meeting/Reservation3.ts") + "";
    // let to = fs.readFileSync("./build/model/Reservation.ts") + "";
    // let res = CodeMerge.merge(fstr, to)
    // fs.writeFileSync("./build/model/Reservation2.ts", res)

    let now = new Date();
    expect(lib.newDate(now, 0, 1) > now).toEqual(true)

    expect(lib.newDate(now, 0, -1) > now).toEqual(false)

    expect(await vali.check(new TestValidSub())).toEqual([false, "a 不能小于:1"]);
    expect(await vali.check(new TestValidSub2())).toEqual([true, ""]);
    expect(await vali.check(new TestValidSub3())).toEqual([false, "b 不能为空"]);

    expect(await vali.check(new TestValidSub4())).toEqual([false, "请输入内容"]);
    expect(await vali.check(new TestValidSub5())).toEqual([false, "长度不能少于2"]);

    expect(await vali.check(new TestValidSub6())).toEqual([true, ""]);

    expect(await vali.check(new TestValid())).toEqual([false, "aa 不能为空"]);

    expect(await vali.check(new TestValid2())).toEqual([true, ""]);
    expect(await vali.check(new TestValid3())).toEqual([true, ""]);

    expect(await vali.check(new TestValid4())).toEqual([false, "长度不能少于2"]);

    expect(await vali.check(new TestValid5())).toEqual([true, ""]);

    expect(await vali.check(new TestValid6())).toEqual([false, "长度不能少于2"]);

    expect(lib.gbkEncode("一个测试")).toEqual([210, 187, 184, 246, 178, 226, 202, 212])


    expect(lib.gbkDecode([210, 187, 184, 246, 178, 226, 202, 212])).toBe("一个测试")

    expect(lib.gbkEncodeURIComponent("一个测试")).toEqual("%D2%BB%B8%F6%B2%E2%CA%D4")

    expect(lib.gbkDecodeURIComponent("%D2%BB%B8%F6%B2%E2%CA%D4")).toEqual("一个测试")

    expect(TypeJson.stringify(new TessA())).toEqual(`{"a":1}`)




});