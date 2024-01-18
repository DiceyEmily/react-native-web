/**
 * @format
 */
import { array, arrayBool, arrayNumber, arrayString, lib } from "../src/rn-common/lib/lib";
import { TypeJson } from "../src/rn-common/lib/TypeJson";


class Tes {
  jinjichengdu = "";
  appGUID = 0;
  wenjiantype2 = true;
}


class Tes2 {
  jinjichengdu = "";
  appGUID = 0;
  wenjiantype2 = true;
  t1 = new Tes();
}

class Tes3 {
  jinjichengdu = "";
  appGUID = 0;
  wenjiantype2 = true;
  t2 = new Tes2();
}


test('TypeJson', async () => {
  lib.getUniqueId()

  let str = `
  {
	"jinjichengdu": "普通",
	"banwenbianhao": "[2020]3745",
	"shouwenriqi": "2020-08-27",
	"wenjiantype": "办件",
  "wenjiantype2": false,
	"appGUID": 5
}
  `
  expect(JSON.stringify(TypeJson.parse(str, Tes))).toBe("{\"jinjichengdu\":\"普通\",\"appGUID\":5,\"wenjiantype2\":false}");

  expect(JSON.stringify(TypeJson.parse(str, {} as any))).toBe("{\"jinjichengdu\":\"普通\",\"banwenbianhao\":\"[2020]3745\",\"shouwenriqi\":\"2020-08-27\",\"wenjiantype\":\"办件\",\"wenjiantype2\":false,\"appGUID\":5}");


  expect(JSON.stringify(TypeJson.parse(`
  {
	"jinjichengdu": "普通",
	"banwenbianhao": "[2020]3745",
	"shouwenriqi": "2020-08-27",
	"wenjiantype": "办件",
  "wenjiantype2": null
}
  `, Tes))).toBe("{\"jinjichengdu\":\"普通\",\"appGUID\":0,\"wenjiantype2\":true}");


  expect(JSON.stringify(TypeJson.parse(`
  {
	"jinjichengdu": "普通",
	"banwenbianhao": "[2020]3745",
	"shouwenriqi": "2020-08-27",
	"wenjiantype": "办件",
  "wenjiantype2": null,
  "t1":{
    	"jinjichengdu": "普通2"
  }
}
  `, Tes2))).toBe("{\"jinjichengdu\":\"普通\",\"appGUID\":0,\"wenjiantype2\":true,\"t1\":{\"jinjichengdu\":\"普通2\",\"appGUID\":0,\"wenjiantype2\":true}}");

  expect(JSON.stringify(TypeJson.parse(`
  {
	"jinjichengdu": "普通",
	"banwenbianhao": "[2020]3745",
	"shouwenriqi": "2020-08-27",
	"wenjiantype": "办件"
}
  `, Tes2))).toBe("{\"jinjichengdu\":\"普通\",\"appGUID\":0,\"wenjiantype2\":true,\"t1\":{\"jinjichengdu\":\"\",\"appGUID\":0,\"wenjiantype2\":true}}");


  expect(JSON.stringify(TypeJson.parse(`
  {
	"jinjichengdu": "普通",
	"banwenbianhao": "[2020]3745",
	"shouwenriqi": "2020-08-27",
	"wenjiantype": "办件",
  "wenjiantype2": null,
  "t2":{
    	"jinjichengdu": "普通2"
  }
}
  `, Tes3))).toBe("{\"jinjichengdu\":\"普通\",\"appGUID\":0,\"wenjiantype2\":true,\"t2\":{\"jinjichengdu\":\"普通2\",\"appGUID\":0,\"wenjiantype2\":true,\"t1\":{\"jinjichengdu\":\"\",\"appGUID\":0,\"wenjiantype2\":true}}}");



  class Tes4 {
    jinjichengdu = "";
    appGUID = 0;
    wenjiantype2 = true;
    t2 = {};
  }
  expect(JSON.stringify(TypeJson.parse(`
  {
	"jinjichengdu": "普通",
	"banwenbianhao": "[2020]3745",
	"shouwenriqi": "2020-08-27",
	"wenjiantype": "办件",
  "wenjiantype2": null,
  "t2":{
    	"jinjichengdu": "普通2"
  }
}
  `, Tes4))).toBe("{\"jinjichengdu\":\"普通\",\"appGUID\":0,\"wenjiantype2\":true,\"t2\":{\"jinjichengdu\":\"普通2\"}}");



  class Tes5 {
    jinjichengdu = "";
    appGUID = 0;
    wenjiantype2 = true;
    wenjiantype = arrayNumber();
    t2 = {};
  }



  expect(JSON.stringify(TypeJson.parse(`
  {
	"jinjichengdu": "普通",
	"banwenbianhao": "[2020]3745",
	"shouwenriqi": "2020-08-27",
	"wenjiantype": [1,2,3,"4",null],
  "wenjiantype2": null,
  "t2":{
    	"jinjichengdu": "普通2"
  }
}
  `, Tes5))).toBe("{\"jinjichengdu\":\"普通\",\"appGUID\":0,\"wenjiantype2\":true,\"wenjiantype\":[1,2,3,4,0],\"t2\":{\"jinjichengdu\":\"普通2\"}}");

  class Tes6 {
    jinjichengdu = "";
    appGUID = 0;
    wenjiantype2 = true;
    wenjiantype = Array();
    t2 = {};
  }
  expect(JSON.stringify(TypeJson.parse(`
  {
	"jinjichengdu": "普通",
	"banwenbianhao": "[2020]3745",
	"shouwenriqi": "2020-08-27",
	"wenjiantype": [1,2,3,"4",null],
  "wenjiantype2": null,
  "t2":{
    	"jinjichengdu": "普通2"
  }
}
  `, Tes6))).toBe("{\"jinjichengdu\":\"普通\",\"appGUID\":0,\"wenjiantype2\":true,\"wenjiantype\":[1,2,3,\"4\",null],\"t2\":{\"jinjichengdu\":\"普通2\"}}");


  class Tes7 {
    jinjichengdu = "";
    appGUID = 0;
    wenjiantype2 = true;
    wenjiantype = arrayBool();
    t2 = {};
  }
  expect(JSON.stringify(TypeJson.parse(`
  {
	"jinjichengdu": "普通",
	"banwenbianhao": "[2020]3745",
	"shouwenriqi": "2020-08-27",
	"wenjiantype": [1,true,3,"4",null],
  "wenjiantype2": null,
  "t2":{
    	"jinjichengdu": "普通2"
  }
}
  `, Tes7))).toBe("{\"jinjichengdu\":\"普通\",\"appGUID\":0,\"wenjiantype2\":true,\"wenjiantype\":[true,true,true,true,false],\"t2\":{\"jinjichengdu\":\"普通2\"}}");

  class Tes8 {
    jinjichengdu = "";
    appGUID = 0;
    wenjiantype2 = true;
    wenjiantype = array(Tes);
  }
  expect(JSON.stringify(TypeJson.parse(`
  {
	"jinjichengdu": "普通",
	"banwenbianhao": "[2020]3745",
	"shouwenriqi": "2020-08-27",
	"wenjiantype": [1,true,{
    	"jinjichengdu": "普通2"
  },"4",null],
  "wenjiantype2": null
}
  `, Tes8))).toBe("{\"jinjichengdu\":\"普通\",\"appGUID\":0,\"wenjiantype2\":true,\"wenjiantype\":[{\"jinjichengdu\":\"\",\"appGUID\":0,\"wenjiantype2\":true},{\"jinjichengdu\":\"\",\"appGUID\":0,\"wenjiantype2\":true},{\"jinjichengdu\":\"普通2\",\"appGUID\":0,\"wenjiantype2\":true},{\"jinjichengdu\":\"\",\"appGUID\":0,\"wenjiantype2\":true},{\"jinjichengdu\":\"\",\"appGUID\":0,\"wenjiantype2\":true}]}");


  class Tes9 {
    jinjichengdu = "";

    @TypeJson.nullAble
    appGUID?= 0;

    @TypeJson.nullAble
    wenjiantype2 = true;

    @TypeJson.nullAble
    shouwenriqi = ""

    wenjiantype = arrayBool();
    t2 = {};

    @TypeJson.nullAble
    t3 = {}
  }
  expect(JSON.stringify(TypeJson.parse(`
  {
    "appGUID":null,
	"jinjichengdu": "普通",
	"banwenbianhao": "[2020]3745",
	"shouwenriqi": null,
	"wenjiantype": [1,true,3,"4",null],
  "wenjiantype2": null,
  "t2":{
    	"jinjichengdu": "普通2"
  }
}
  `, Tes9))).toBe("{\"jinjichengdu\":\"普通\",\"appGUID\":null,\"wenjiantype2\":null,\"shouwenriqi\":null,\"wenjiantype\":[true,true,true,true,false],\"t2\":{\"jinjichengdu\":\"普通2\"}}");


  class Tes10 {
    jinjichengdu = "";

    @TypeJson.nullAble
    appGUID = 0;

    @TypeJson.nullAble
    wenjiantype2 = true;

    @TypeJson.nullAble
    shouwenriqi = ""

    wenjiantype = arrayString();
    t2 = {};

    @TypeJson.nullAble
    t3 = {}
  }
  expect(JSON.stringify(TypeJson.parse(`
  {
    "appGUID":null,
	"jinjichengdu": "普通",
	"banwenbianhao": "[2020]3745",
	"shouwenriqi": null,
	"wenjiantype": [1,true,3,"4",null],
  "wenjiantype2": null,
  "t2":{
    	"jinjichengdu": "普通2"
  }
}
  `, Tes10))).toBe("{\"jinjichengdu\":\"普通\",\"appGUID\":null,\"wenjiantype2\":null,\"shouwenriqi\":null,\"wenjiantype\":[\"1\",\"true\",\"3\",\"4\",\"\"],\"t2\":{\"jinjichengdu\":\"普通2\"}}");


  expect(JSON.stringify(TypeJson.parse(`
  [1,"2",3,null,true,"aaa"]
  `, arrayString()))).toBe("[\"1\",\"2\",\"3\",\"\",\"true\",\"aaa\"]");

  expect(JSON.stringify(TypeJson.parse(`
  [1,"2",3,null,true,"aaa",false]
  `, arrayBool()))).toBe("[true,true,true,false,true,true,false]");

  expect(JSON.stringify(TypeJson.parse(`
  [1,"2",3,null,true,"aaa",false]
  `, arrayNumber()))).toBe("[1,2,3,0,0,0,0]");

  expect(JSON.stringify(TypeJson.parse(`
  {}
  `, arrayNumber()))).toBe("[]");


  expect(JSON.stringify(TypeJson.parse(`
  [[1,2,3],"2",[],null,[1,"2",true,null],1,true,"aaa",false]
  `, array(arrayNumber())))).toBe("[[1,2,3],[],[],[],[1,2,0,0],[],[],[],[]]");

  expect(JSON.stringify(TypeJson.parse(`
  [[1,[7,8,9],3],"2",[],null]
  `, array(array(arrayNumber()))))).toBe("[[[],[7,8,9],[]],[],[],[]]");



  class Tes11 {
    jinjichengdu = "";
    appGUID = 0;
    wenjiantype2 = true;
    wenjiantype = array(array(Tes));
  }
  expect(JSON.stringify(TypeJson.parse(`
  {
	"jinjichengdu": "普通",
	"banwenbianhao": "[2020]3745",
	"shouwenriqi": "2020-08-27",
	"wenjiantype": [1,true,[],[{
    	"jinjichengdu": "普通2"
  }],"4",null],
  "wenjiantype2": null
}
  `, Tes11))).toBe("{\"jinjichengdu\":\"普通\",\"appGUID\":0,\"wenjiantype2\":true,\"wenjiantype\":[[],[],[],[{\"jinjichengdu\":\"普通2\",\"appGUID\":0,\"wenjiantype2\":true}],[],[]]}");


  ////////////////////test end////////////////
});

