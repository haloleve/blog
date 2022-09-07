<center><h1>Mock</h1></center>

## 1. 什么是MockJS

Mock.js 是一款模拟数据生成器，旨在帮助前端攻城师独立于后端进行开发，帮助编写单元测试。提供了以下模拟功能：

+ 根据数据模板生成模拟数据
+ 模拟 Ajax 请求，生成并返回模拟数据
+ 基于 HTML 模板生成模拟数据

## 2. 简单使用

```js
// 安装
npm install mockjs
```

```js
// 使用
var Mock = require('mockjs');
var data = Mock.mock({
    'list|1-10': [{
        'id|+1': 1
    }]
});
console.log(JSON.stringify(data, null, 4))

{
    "list": [
        {
            "id": 1
        },
        {
            "id": 2
        },
        {
            "id": 3
        }
    ]
}
```

### 2.1 语法规范

Mock.js 的语法规范包括两部分：

1. 数据模板定义（Data Temaplte Definition，DTD）
2. 数据占位符定义（Data Placeholder Definition，DPD）

#### 数据模板定义 DTD

**数据模板中的每个属性由 3 部分构成：属性名、生成规则、属性值：**

```js
// 属性名   name
// 生成规则 rule
// 属性值   value
'name|rule': value   // 'list|1-10' name|rule
```

**注意：**

+ 属性名 和 生成规则 之间用 `|` 分隔。
+ 生成规则 是可选的。
+ 生成规则 有 7 种格式：
  1. `'name|min-max': value`
  2. `'name|count': value`
  3. `'name|min-max.dmin-dmax': value`
  4. `'name|min-max.dcount': value`
  5. `'name|count.dmin-dmax': value`
  6. `'name|count.dcount': value`
  7. `'name|+step': value`

+ **生成规则 的 含义 需要依赖 属性值 才能确定。**
+ 属性值 中可以含有 `@占位符`。
+ 属性值 还指定了最终值的初始值和类型。

##### 生成规则和示例：

属性值是==字符串== **String**

1. `'name|min-max': 'value'` 通过重复 `'value'` 生成一个字符串，重复次数大于等于 `min`，小于等于 `max`。
2. `'name|count': 'value'` 通过重复 `'value'` 生成一个字符串，重复次数等于 `count`。

```js
let data = Mock.mock({
  'number1|1-10': '1',
  'number2|2': '2',
});
console.log(JSON.stringify(data,null,4));
// 属性值是字符串：String
{
    "number1": "1111111111",
    "number2": "22"
}
```

属性值是数字**Number**

属性值是Number的时候，value==没什么用==。

1. `'name|+1': 100` 属性值自动加 1，初始值为 100
2. `'name|1-100': 100` 生成一个大于等于 1、小于等于 100 的整数，属性值 100 只用来确定类型。
3. `'name|1-100.1-10': 100` 生成一个浮点数，整数部分大于等于 1、小于等于 100，小数部分保留 1 到 10 位。

```js
let data = Mock.mock({
  'num1|+1': 100, //初始值是100,每次循环加一
  'num2|1-100': 100, //生成一个1-100的数字，类型是属性值提供的
  'num3|1-100.1-10': 100 //整数部分1-100 小数部分1-10个
});
console.log(JSON.stringify(data,null,4));

// 属性值是字符串：Number
{
    "num1": 100,
    "num2": 22,
    "num3": 66.632
}
```

属性值是布尔型 **Boolean**

1. `'name|1': value` 随机生成一个布尔值，值为 true 的概率是 1/2，值为 false 的概率是 1/2。
2. `'name|min-max': value` 随机生成一个布尔值，值为 `value` 的概率是 `min / (min + max)`，值为 `!value` 的概率是 `max / (min + max)`。

```js
let data = Mock.mock({
  'name|1': true, // 1/2true|false
  'name1|1-3': true // 四分之一是 true | 3/4是false
});
console.log(JSON.stringify(data,null,4));

// 属性值是字符串：Boolean
{
    "name": false,
    "name1": true
}
```

属性值是对象 **Object**

1. `'name|min-max': {}` 从属性值 `{}` 中随机选取 `min` 到 `max` 个属性。
2. `'name|count': {}` 从属性值 `{}` 中随机选取 `count` 个属性。

```js
let Mock = require('mockjs');
let obj = {
  a: 1,
  b: 2,
  c: 3,
  d: 4
}
let data = Mock.mock({
  'name|1-4': obj, // 从属性值 {} 中随机选取 min 到 max 个属性。
  'name1|3': obj, // 从属性值 {} 中随机选取 count 个属性。
});
console.log(JSON.stringify(data,null,4));

// 属性值是字符串：Object
{
    "name": {
        "d": 4
    },
    "name1": {
        "b": 2,
        "c": 3,
        "a": 1
    }
}
```

属性值是数组 **Array**

1. `'name|1': [{}, {} ...]` 从属性值 `[{}, {} ...]` 中随机选取 1 个元素，作为最终值。
2. `'name|min-max': [{}, {} ...]` 通过重复属性值 `[{}, {} ...]` 生成一个新数组，重复次数大于等于 `min`，小于等于 `max`。
3. `'name|count': [{}, {} ...]` 通过重复属性值 `[{}, {} ...]` 生成一个新数组，重复次数为 `count`。

```js
let Mock = require('mockjs');
let obj = {
  a: 1,
  b: 2,
  c: 3,
  d: 4
};
let arr = [{
  name: 'zs'
},{ name: 'lis' },{ name: 'wwu' }]

let data = Mock.mock({
  'name|1': arr, // 从属性值arr随机选取一个元素，做为最终值
  'name1|1-2': arr, // 重复1-3次arr中的每一个属性生成一个数组
  'name2|2': arr, // 和min-max 一样 不过限定了次数
});
console.log(JSON.stringify(data,null,4));

// 属性值是字符串：Array
{
    "name": {
        "name": "lis"
    },
    "name1": [ // 这里重复了两次arr
        {
            "name": "zs"
        },
        {
            "name": "lis"
        },
        {
            "name": "wwu"
        },
        {
            "name": "zs"
        },
        {
            "name": "lis"
        },
        {
            "name": "wwu"
        }
    ]
}


```

属性值是数组 **Function**

`'name': function(){}` 执行函数 `function(){}`，取其返回值作为最终的属性值，上下文为 `'name'` 所在的对象。

```js
let data = Mock.mock({
  name: function () {
    return 1;
  }, // 取其返回值作为最终的属性值，上下文为 'name' 所在的对象。
});
console.log(JSON.stringify(data,null,4));

// 属性值是字符串：Function
{
    "name": 1
}
```

属性值是数组 **RegExp**

根据正则表达式反向生成对应的字符串，用于生成自定义格式的字符串

```js
var data = Mock.mock({
    'name1':/[a-z][A-Z]/,
    'name2':/\d{1,3}/
})
console.log(JSON.stringify(data,null,4));

// 属性值是数组 RegExp
{
    "name1": "sT",
    "name2": "76"
}
```



#### 数据占位符定义 DPD

占位符 只是在属性值字符串中占个位置，并不出现在最终的属性值中。占位符 的格式为：

```js
@占位符
@占位符(参数 [, 参数])
```

**注意：**

1. 用 `@` 来标识其后的字符串是 占位符。
2. 占位符 引用的是 `Mock.Random` 中的方法。
3. 通过 `Mock.Random.extend()` 来扩展自定义占位符。
4. 占位符 也可以引用 数据模板 中的属性。
5. 占位符 会优先引用 数据模板 中的属性。

### 2.2 Mock.mock()基本使用

#### Mock.mock( rurl?, rtype?, template|function(options) )

这是mock的核心方法，用于生成模拟数据，前边的例子中我们都已经见识过了。 

根据数据模板生成模拟数据。

+ **Mock.mock( template )**

  根据数据模板生成模拟数据。( 就是上面的数据模板定义和数据占位符定义 )

+ **Mock.mock( rurl, template )**

  记录数据模板。当拦截到匹配 `rurl` 的 Ajax 请求时，将根据数据模板 `template` 生成模拟数据，并作为响应数据返回。

+ **Mock.mock( rurl, function(options) )**

  记录用于生成响应数据的函数。当拦截到匹配 `rurl` 的 Ajax 请求时，函数 `function(options)` 将被执行，并把执行结果作为响应数据返回。

+ **Mock.mock( rurl, rtype, template )**

  记录数据模板。当拦截到匹配 `rurl` 和 `rtype` 的 Ajax 请求时，将根据数据模板 `template` 生成模拟数据，并作为响应数据返回。

+ **Mock.mock( rurl, rtype, function(options) )**

  记录用于生成响应数据的函数。当拦截到匹配 `rurl` 和 `rtype` 的 Ajax 请求时，函数 `function(options)` 将被执行，并把执行结果作为响应数据返回。

~~~~

~~~~

**参数的含义和默认值**如下所示：

+ **参数 rurl**：可选。表示需要拦截的 URL，可以是 URL 字符串或 URL 正则。例如 `/\/domain\/list\.json/`、`'/domian/list.json'`。
+ **参数 rtype**：可选。表示需要拦截的 Ajax 请求类型。例如 `GET`、`POST`、`PUT`、`DELETE` 等。
+ **参数 template**：可选。表示数据模板，可以是对象或字符串。例如 `{ 'data|1-10':[{}] }`、`'@EMAIL'`。
+ **参数 function(options)**：可选。表示用于生成响应数据的函数。
+ **参数 options**：指向本次请求的 Ajax 选项集。

### 2.3 Mock.setup()

配置拦截 Ajax 请求时的行为。支持的配置项有：`timeout`。

**settings**

必选。配置项集合。

**timeout**

可选。

指定被拦截的 Ajax 请求的响应时间，单位是毫秒。值可以是正整数，例如 `400`，表示 400 毫秒 后才会返回响应内容；也可以是横杠 `'-'` 风格的字符串，例如 `'200-600'`，表示响应时间介于 200 和 600 毫秒之间。默认值是`'10-100'`。

```js
Mock.setup({
    timeout: 400
})
Mock.setup({
    timeout: '200-600'
})
```

> 目前，接口 `Mock.setup( settings )` 仅用于配置 Ajax 请求，将来可能用于配置 Mock 的其他行为。

#### Mock.valid(template,data)

校验真实数据 `data` 是否与数据模板 `template` 匹配。

**template**

表示数据模板，可以是对象或字符串。例如 `{ 'list|1-10':[{}] }`、`'@EMAIL'`。

**data**

表示真实数据

```js
var template = {
    name: 'value1'
}
var data = {
    name: 'value2'
}
Mock.valid(template, data)
// =>
[
    {
        "path": [
            "data",
            "name"
        ],
        "type": "value",
        "actual": "value2",
        "expected": "value1",
        "action": "equal to",
        "message": "[VALUE] Expect ROOT.name'value is equal to value1, but is value2"
    }
]
```



#### Mock.toJSONShema(template)

把 Mock.js 风格的数据模板 `template` 转换成 [JSON Schema](http://json-schema.org/)。

```js
var template = {
    'key|1-10': '★'
}
Mock.toJSONSchema(template)
// =>
{
    "name": undefined,
    "path": [
        "ROOT"
    ],
    "type": "object",
    "template": {
        "key|1-10": "★"
    },
    "rule": {},
    "properties": [{
        "name": "key",
        "path": [
            "ROOT",
            "key"
        ],
        "type": "string",
        "template": "★",
        "rule": {
            "parameters": ["key|1-10", "key", null, "1-10", null],
            "range": ["1-10", "1", "10"],
            "min": 1,
            "max": 10,
            "count": 3,
            "decimal": undefined,
            "dmin": undefined,
            "dmax": undefined,
            "dcount": undefined
        }
    }]
}
```



### 2.4 Mock.Random()

Mock.Random 是一个工具类，用于生成各种随机数据。

```js
var Random = Mock.Random
Random.email()
// => "n.clark@miller.io"
Mock.mock('@email')
// => "y.lee@lewis.org"
Mock.mock( { email: '@email' } )
// => { email: "v.lewis@hall.gov" 
```

#### 扩展

Mock.Random 中的方法与数据模板的 `@占位符` 一一对应，在需要时还可以为 Mock.Random 扩展方法，然后在数据模板中通过 `@扩展方法` 引用。例如：

```js
Random.extend({
    constellation: function(date) {
        var constellations = ['白羊座', '金牛座', '双子座', '巨蟹座', '狮子座', '处女座', '天秤座', '天蝎座', '射手座', '摩羯座', '水瓶座', '双鱼座']
        return this.pick(constellations)
    }
})
Random.constellation()
// => "水瓶座"
Mock.mock('@CONSTELLATION')
// => "天蝎座"
Mock.mock({
    constellation: '@CONSTELLATION'
})
// => { constellation: "射手座" }
```

```js
let Random = Mock.Random;
Random.extend({
  SymbolicAnimal: function(date){
    let Sa = ['鼠','牛','虎','兔'];
    return this.pick(Sa)
  }
});
console.log(Random.SymbolicAnimal());
console.log(Mock.mock('@SymbolicAnimal'));
console.log(Mock.mock({ SymbolicAnimal: '@SymbolicAnimal' }));
```



#### 方法

Mock.Random 提供的完整方法（占位符）如下：

| Type          | Method                                                       |
| ------------- | ------------------------------------------------------------ |
| Basic         | boolean, natural, integer, float, character, string, range, date, time, datetime, now |
| Image         | image, dataImage                                             |
| Color         | color                                                        |
| Text          | paragraph, sentence, word, title, cparagraph, csentence, cword, ctitle |
| Name          | first, last, name, cfirst, clast, cname                      |
| Web           | url, domain, email, ip, tld                                  |
| Address       | area, region                                                 |
| Helper        | capitalize, upper, lower, pick, shuffle                      |
| Miscellaneous | guid, id                                                     |

#### Basic

Random.boolean(min?max?current?)

```js
let Random = Mock.Random;
let bol1 = Random.boolean(1, 3, false);
let bol2 = Random.boolean(false);
console.log(bol1+ '----' + bol2);

// false----true
```



Random.nature(min?max)

随机生成一个自然数，什么叫自然数，就是大于等于0的

```js
var natural1 = Random.natural();       //默认值最大为 9007199254740992
var natural2 = Random.natural(4);         //随机出来的最小值是4
var natural3 = Random.natural(6,9)   // 随机出来的是6-9
```



Random.Integer(min?,max?)

生成一个随机的整数，可以是负数。

```js
var integer1 = Random.integer();  // 最小值：-9007199254740992 最大值：9007199254740992
var integer2 = Random.integer(-10);        //随机最小值是-10
var integer3 = Random.integer(-10,20);
```



Random.float(min?,max?,dmin?,dmax?)

随机生成一个小数浮点数,四个参数分别为，整数部分最小值最大值( 同上 )，小数部分最小值最大值 ( 0,17 )。

```js
var float1 = Random.float();
var float2 = Random.float(3,8);
var float3 = Random.float(1,3,5,7) // 111.12345
```



Random.character(pool?)

随机生成一个字符,pool的值可以是：

+ upper: 26个大写字母
+ lower: 26个小写字母
+ number: 0到9十个数字
+ sympol: "!@#$%^&*()[]"

```js
{
    lower: "abcdefghijklmnopqrstuvwxyz",
    upper: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
    number: "0123456789",
    symbol: "!@#$%^&*()[]"
}

var character1 = Random.character();
var character2 = Random.character('lower');
var character3 = Random.character('upper');
var character4 = Random.character('symbol');
```



Random.string(pool?,min?,max?)

随机生成一个字符串，pool的值同上边四个。( min:3, max：7 )

```js
var str1 = Random.string();                //  默认长度3到7位
var str2 = Random.string(5);               //长度5位
var str3 = Random.string('lower',7);       //长度7位，小写
var str4 = Random.string(4,6);             //长度4到
var str5 = Random.string('新的字符串会从这里选择4到5位',4,6);   //从第一个参数里选择4到5位
```



Random.range(start?,stop,step?)

返回一个整型数组

+ start,可选，数组起始值，闭区间
+ stop,必选，数据结束值，开区间
+ step,可选，数据每一项间隔值

```js
var range1 = Random.range(10);     //[0,1,2,3,4,5,6,7,8,9]
var range2 = Random.range(14,20);  //[14,15,16,17,18,19]
var range3 = Random.range(3,13,2); //[3,5,7,9,11]
```

#### Date

Random.date(format?)

返回一个随机日期的字符串 : 指示生成的日期字符串的格式。默认值为 `yyyy-MM-dd`。

| Format | Description                                              | Example      |
| ------ | -------------------------------------------------------- | ------------ |
| yyyy   | A full numeric representation of a year, 4 digits        | 1999 or 2003 |
| yy     | A two digit representation of a year                     | 99 or 03     |
| y      | A two digit representation of a year                     | 99 or 03     |
| MM     | Numeric representation of a month, with leading zeros    | 01 to 12     |
| M      | Numeric representation of a month, without leading zeros | 1 to 12      |
| dd     | Day of the month, 2 digits with leading zeros            | 01 to 31     |
| d      | Day of the month without leading zeros                   | 1 to 31      |
| HH     | 24-hour format of an hour with leading zeros             | 00 to 23     |
| H      | 24-hour format of an hour without leading zeros          | 0 to 23      |
| hh     | 12-hour format of an hour without leading zeros          | 1 to 12      |
| h      | 12-hour format of an hour with leading zeros             | 01 to 12     |
| mm     | Minutes, with leading zeros                              | 00 to 59     |
| m      | Minutes, without leading zeros                           | 0 to 59      |
| ss     | Seconds, with leading zeros                              | 00 to 59     |
| s      | Seconds, without leading zeros                           | 0 to 59      |
| SS     | Milliseconds, with leading zeros                         | 000 to 999   |
| S      | Milliseconds, without leading zeros                      | 0 to 999     |
| A      | Uppercase Ante meridiem and Post meridiem                | AM or PM     |
| a      | Lowercase Ante meridiem and Post meridiem                | am or pm     |
| T      | Milliseconds, since 1970-1-1 00:00:00 UTC                | 759883437303 |

```js
var date1 = Random.date(); // 默认yyyy-MM-dd            // 2011-08-25
var date2 = Random.date('yyyy-MM-dd'); // 1982-04-23
var date3 = Random.date('y-M-d');      // 95-12-26
var date4 = Random.date('yy-MM-dd');   // 78-01-19
```



Random.time(format?)

返回时间字符串  :  format的格式是‘HH-mm-ss’

```js
var time1 = Random.time();				// 02:42:21
var time2 = Random.time('HH-mm-ss');    // 14-05-41
var time3 = Random.time('J-m-s');		// J-49-34
```



Random.datetime(format?)

上边两个的结合版

```js
var dt1 = Random.datetime();	// 2009-01-29 17:57:28
var dt2 = Random.datetime('yyyy-MM-dd HH-mm-ss'); 	// 1974-10-27 01-08-38
```



Random.now(unit?,format?)

unit:  表示时间单位，用于对当前日期和时间进行格式化。可选值有：`year`、`month`、`week`、`day`、`hour`、`minute`、`second`、`week`，默认不会格式化。

返回当前时间的字符串

```js
Random.now()
// => "2014-04-29 20:08:38 "
Random.now('day', 'yyyy-MM-dd HH:mm:ss SS')
// => "2014-04-29 00:00:00 000"
Random.now('day')
// => "2014-04-29 00:00:00 "
Random.now('yyyy-MM-dd HH:mm:ss SS')
// => "2014-04-29 20:08:38 157"

Random.now('year')
// => "2014-01-01 00:00:00"
Random.now('month')
// => "2014-04-01 00:00:00"
Random.now('week')
// => "2014-04-27 00:00:00"
Random.now('day')
// => "2014-04-29 00:00:00"
Random.now('hour')
// => "2014-04-29 20:00:00"
Random.now('minute')
// => "2014-04-29 20:08:00"
Random.now('second')
// => "2014-04-29 20:08:38"
```

#### Image

> 一般情况下，使用dataImage更好,因为更简单，但是如果要生成高度自定义的图片，则最好用image。另外，dataImage生成的是base64编码

Random.image(size?,background?,foreground?,format?text?)

+ size 图片宽高，格式是'宽x高'
+ background:图片的背景色，默认值#000000
+ foreground：图片的文字前景色，默认#FFFFFF
+ format：图片的格式，默认'.png'
+ text:图片上的默认文字，默认值为参数size

其中size的取值范围是

```
[
    '300x250', '250x250', '240x400', '336x280', 
    '180x150', '720x300', '468x60', '234x60', 
    '88x31', '120x90', '120x60', '120x240', 
    '125x125', '728x90', '160x600', '120x600', 
    '300x600'
]
```

图片的格式可以选择.png .gif .jpg

```js
var image1 = Random.image();
var image2 = Random.image('128x90');
var image3 = Random.image('120x660','#ccc');    //前景色#ccc
var image4 = Random.image('226x280','#eee','第三个参数是文字不是前景色');
var image5 = Random.image('66x31','#ddd','#123456','四个参数的时候第三个参数是前景色');
var image6 = Random.image('240x400','#333','#1483dc','.gif','全部参数的情况下');

Random.image()
// => "http://dummyimage.com/125x125"
Random.image('200x100')
// => "http://dummyimage.com/200x100"
Random.image('200x100', '#fb0a2a')
// => "http://dummyimage.com/200x100/fb0a2a"
Random.image('200x100', '#02adea', 'Hello')
// => "http://dummyimage.com/200x100/02adea&text=Hello"
Random.image('200x100', '#00405d', '#FFF', 'Mock.js')
// => "http://dummyimage.com/200x100/00405d/FFF&text=Mock.js"
Random.image('200x100', '#ffcc33', '#FFF', 'png', '!')
// => "http://dummyimage.com/200x100/ffcc33/FFF.png&text=!"
```



Random.dataImage(size?,text?)

返回一段base64编码，两个参数同上。

```js
var di1 = Random.dataImage();
var di2 = Random.datImage('300x600');
var di3 = Random.dataImage('180x150','hahahaha');
```

#### Color

Random.color() 有好几个相关方法

```js
var color = Random.color(); 格式'#rrggbb'
var hex = Random.hex();   //好像和color没什么不同
var rgb = Random.rgb();   //生成格式如rgb(133,233,244)
var rgba = Random.rgba(); //生成个事如rgba(111,222,233,0.5)
var hsl = Random.hsl();   //生成格式(345,82,71)
```

#### Text

Random.paragraph(min?,max?,len?) 。随机生成一段文本

指示文本中==句子==的个数。默认值为 3 到 7 之间的随机数。

```js
var para1 = Random.paragraph();    //随机生成一短文本，范围3到7
var para2 = Random.paragraph(10);  //随机生成长度是10的文本
var para3 = Random.paragraph(9,12); //随机生成9到11位长度的文本
```



Random.cparagraph( min?, max? )  随机生成一段中文文本。

+ Random.cparagraph()
+ Random.cparagraph( len )
+ Random.cparagraph( min, max )

参数的含义和默认值同上

```js
var time1 = Random.cparagraph(1);  // 身农门比音越界报府具积取广。
```



Random.sentence( min?, max? )

+ Random.sentence()
+ Random.sentence( len )
+ Random.sentence( min, max )

```js
Random.sentence()
// => "Jovasojt qopupwh plciewh dryir zsqsvlkga yeam."
Random.sentence(5)
// => "Fwlymyyw htccsrgdk rgemfpyt cffydvvpc ycgvno."
Random.sentence(3, 5)
// => "Mgl qhrprwkhb etvwfbixm jbqmg."
```



Random.csentence( min?, max? ) 默认值为 12 到 18 之间的随机数。

+ Random.csentence()
+ Random.csentence( len )
+ Random.csentence( min, max )

随机生成一段中文文本。参数的含义和默认值同 [Random.sentence( min?, max? )](#Random.sentence( min?, max? ))

```json
Random.csentence()
// => "第任人九同段形位第律认得。"
Random.csentence(2)
// => "维总。"
Random.csentence(1, 3)
// => "厂存。"
```



Random.word( min?, max? )

+ Random.word()
+ Random.word( len )
+ Random.word( min, max )

随机生成一个单词。默认值为 3 到 10 之间的随机数。

```js
Random.word()
// => "fxpocl"
Random.word(5)
// => "xfqjb"
Random.word(3, 5)
// => "kemh"
```



Random.cword( pool?, min?, max? )

+ Random.cword()
+ Random.cword( pool )
+ Random.cword( length )
+ Random.cword( pool, length )
+ Random.cword( min, max )
+ Random.cword( pool, min, max )

随机生成一个汉字。字数是一个

```js
Random.cword()
// => "干"
Random.cword('零一二三四五六七八九十')
// => "六"
Random.cword(3)
// => "别金提"
Random.cword('零一二三四五六七八九十', 3)
// => ""七七七""
Random.cword(5, 7)
// => "设过证全争听"
Random.cword('零一二三四五六七八九十', 5, 7)
// => "九七七零四"
```



Random.title( min?, max? )

+ Random.title()
+ Random.title( len )
+ Random.title( min, max )

随机生成一句标题，其中每个单词的首字母大写。默认值为 3 到 7 之间的随机数。

```js
Random.title()
// => "Rduqzr Muwlmmlg Siekwvo Ktn Nkl Orn"
Random.title(5)
// => "Ahknzf Btpehy Xmpc Gonehbnsm Mecfec"
Random.title(3, 5)
// => "Hvjexiondr Pyickubll Owlorjvzys Xfnfwbfk"
```



Random.ctitle( min?, max? )

+ Random.ctitle()
+ Random.ctitle( len )
+ Random.ctitle( min, max )

随机生成一句中文标题。默认值为 3 到 7 之间的随机数。

```js
Random.ctitle()
// => "证构动必作"
Random.ctitle(5)
// => "应青次影育"
Random.ctitle(3, 5)
// => "出料阶相"
```

#### Name

Random.first()

 随机生成一个常见的英文名。

```js
Random.first()
// => "Nancy"
```

Random.last()

随机生成一个常见的英文姓。

```js
Random.last()
// => "Martinez"
```

Random.name()

+ Random.name()
+ Random.name( middle )

随机生成一个常见的英文姓名。middle:  布尔值。指示是否生成中间名。

```js
var time1 = Random.name();
var time2 = Random.name(true);

//Jessica Lewis
//Helen Dorothy Clark
```

Random.cfirst()

+ Random.cfirst()

随机生成一个常见的中文名。

```js
Random.cfirst()
// => "曹"
```

Random.clast()

+ Random.clast()

随机生成一个常见的中文姓。

```js
Random.clast()
// => "艳"
```

Random.cname()

+ Random.cname()

随机生成一个常见的中文姓名。

```js
Random.cname()
// => "袁军"
```

#### Web

Random.url( protocol?, host? )

+ Random.url()
+ Random.url( protocol, host )

随机生成一个 URL。

**protocol**

指定 URL 协议。例如 `http`。

**host**

指定 URL 域名和端口号。例如 `nuysoft.com`。

```js
Random.url()
// => "mid://axmg.bg/bhyq"
Random.url('http')
// => "http://splap.yu/qxzkyoubp"
Random.url('http', 'nuysoft.com')
// => "http://nuysoft.com/ewacecjhe"
```



Random.protocol()

+ Random.protocol()

随机生成一个 URL 协议。返回以下值之一：`'http'`、`'ftp'`、`'gopher'`、`'mailto'`、`'mid'`、`'cid'`、`'news'`、`'nntp'`、`'prospero'`、`'telnet'`、`'rlogin'`、`'tn3270'`、`'wais'`。

```js
Random.protocol()
// => "ftp"
```



Random.domain()

+ Random.domain()

随机生成一个域名。

```js
Random.domain()
// => "kozfnb.org"
```



Random.tld()

+ Random.tld()

随机生成一个顶级域名（Top Level Domain）。

```js
Random.tld()
// => "net"
```



Ramdon.email( domain? )

+ Random.email()
+ Random.email( domain )

随机生成一个邮件地址。

**domain**

指定邮件地址的域名。例如 `nuysoft.com`。

```js
Random.email()
// => "x.davis@jackson.edu"
Random.email('nuysoft.com')
// => "h.pqpneix@nuysoft.com"
```



Random.ip()

+ Random.ip()

随机生成一个 IP 地址。

```js
Random.ip()
// => "34.206.109.169"
```

#### Address

Random.region()

+ Random.region()

随机生成一个（中国）大区。

```js
Random.region()
// => "华北"
```

Random.province()

+ Random.province()

随机生成一个（中国）省（或直辖市、自治区、特别行政区）。

```js
Random.province()
// => "黑龙江省"
```



Random.city( prefix? )

+ Random.city()
+ Random.city( prefix )

随机生成一个（中国）市。prefix? 可选，布尔值。指示是否生成所属的省

```js
Random.city()
// => "唐山市"
Random.city(true)
// => "福建省 漳州市"
```



Random.county( prefix? )

+ Random.county()
+ Random.county( prefix )

随机生成一个（中国）县。prefix? 可选，布尔值。指示是否生成所属的省和市

```js
Random.county()
// => "上杭县"
Random.county(true)
// => "甘肃省 白银市 会宁县"
```

Random.zip()

+ Random.zip()

随机生成一个邮政编码（六位数字）。

```js
Random.zip()
// => "908812"
```

#### Helper

Random.capitalize(word)

+ Random.capitalize(word)

把字符串的第一个字母转换为大写。

```js
Random.capitalize('hello')
// => "Hello"
```

Random.upper(str)

+ Random.upper( str )

把字符串转换为大写。

```js
Random.upper('hello')
// => "HELLO"
```

Random.lower(str)

+ Random.lower( str )

把字符串转换为小写。

```js
Random.lower('HELLO')
// => "hello"
```



Random.pick(arr)

+ Random.pick( arr )

从数组中随机选取一个元素，并返回。

```js
Random.pick(['a', 'e', 'i', 'o', 'u'])
// => "o"
```



Random.shuffle(arr)

+ Random.shuffle( arr )

打乱数组中元素的顺序，并返回。

```js
Random.shuffle(['a', 'e', 'i', 'o', 'u'])
// => ["o", "u", "e", "i", "a"]
```

#### Miscellaneous

Random.guid()

+ Random.guid()

随机生成一个 GUID。

```js
Random.guid()
// => "662C63B4-FD43-66F4-3328-C54E3FF0D56E"
```

Random.id()

+ Random.id()

随机生成一个 18 位身份证。

```js
Random.id()
// => "420000200710091854"
```

Random.increment( step? )

+ Random.increment()
+ Random.increment( step )

生成一个全局的自增整数。step? 整数自增步长。默认值为一。

```js
Random.increment()
// => 1
Random.increment(100)
// => 101
Random.increment(1000)
// => 1101
```
