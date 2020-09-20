$(function(){
    // 全局变量
    var last_prize = {
        // 存放
        'list' : [],
        //位置
        'ption':-1,
        'name':'',
        "index":0,
        //剩余次数
        'frequency':1
    }
    var shangpinList = []
    var settings = {
        "url": "http://localhost:3000/function/prizeInformation",
        "method": "GET",
        "timeout": 0,
        "data": {}
    };
    $.ajax(settings).done(function (response) {
        console.log(response.data)
        shangpinList = response.data
    });


    $('.frequency p>span').text(last_prize.frequency)
    var canvas = $('#myCanvas');
    if(canvas.getContext) {
        console.log("ss");
    }else{
        // 画外圈
        four_circular();
        // 内部扇形
        fan_piece(8,150);
        //
        img(shangpinList)
    }
    // 绘制 4个外圈的圆
    function  four_circular(){
        // 绘制圆1
        circular("20",187,0,2*Math.PI,"#FF6C02")
        // 绘制圆2
        circular("14",175,0,2*Math.PI,"#F0ED99")
        // 绘制圆3
        circular("17",168,0,2*Math.PI,"#FFC68F")
        // 绘制圆4
        circular("10",154,0,2*Math.PI,"#FF740C")
         // 装饰圈
        circular("2",165,0,2*Math.PI,"#D7F5A4")
        // 装饰圈
        circular("2",171,0,2*Math.PI,"#D7F5A4")
    }
    // arc 圆角的绘制
    /**
     * @param {string} width 圆体线的宽度
     * @param {number} r 大小半径
     * @param {string} colour 颜色设置
     * @param {number} sAngle 起始角，以弧度计。（弧的圆形的三点钟位置是 0 度）。
     * @param {number} eAngle 颜色设置 结束角，以弧度计。
     */
    function circular(width,r,sAngle,eAngle,colour){
        // 设置文本 [0]
        var ctx = canvas[0].getContext("2d");
        // 获取canvas的宽度和高度 然后除2得到原点
        var w = ctx.canvas.width / 2;
        var h = ctx.canvas.height /2 ;
        // 弄条线
        ctx.beginPath();
        // 宽度是20
        ctx.lineWidth=width;
        // 200 200 这个中心点 187为大小 设置成圆
        ctx.arc(w,h,r,sAngle,eAngle);
        // 设置这个线的颜色
        ctx.strokeStyle=colour;
        // 绘制线
        ctx.stroke();
    }
    //绘制 内部扇片
    /**
     * @param {number} nums 一个圆分多少份
     * @param {number} r 半径是多少
     */
    function fan_piece(nums,r){
        // 设置文本 [0]
        var ctx = canvas[0].getContext("2d");
        // 获取canvas的宽度和高度 然后除2得到原点
        var w = ctx.canvas.width / 2;
        var h = ctx.canvas.height /2 ;
        /*分成几等分*/
        var num = nums;
        /*一份多少弧度*/ 
        // Math.PI == 180度
        var angle = Math.PI * 2 / num;
        /*上一次绘制的结束弧度等于当前次的起始弧度*/
        for (var i = 0; i < num; i++) {
            // i为第几个 然后乘长几个
            // 开始
            var startAngle = i * angle;
            // console.log(startAngle)
            // 结束
            var endAngle = (i + 1) * angle;
            // console.log(endAngle)
            // 绘制线
            ctx.beginPath();
            // 从那个点开始画
            ctx.moveTo(w, h);
            // 起点开始 然后半径是多少 开始位置 和结束弧度
            ctx.arc(w, h, r, startAngle, endAngle);
            /*背景颜色*/
            ctx.fillStyle = (i%2 == 0) ? '#FEF5CA':'#FFEDA3';
            // 填充当前的图像
            ctx.fill();
        }
    }
    // 渲染商品文字和图片
    function img(dataList){
        var ctx = canvas[0].getContext("2d");
        var ShangData =  dataList
        // 获取canvas的宽度和高度 然后除2得到原点
        var w = ctx.canvas.width / 2;
        var h = ctx.canvas.height /2 ;
        var num = ShangData.length
        var angle = 360 / num
        var ImgList = []
        for(let i=0;i<num;i++){
            var img = new Image()
            img.src = ShangData[i].prizeImg
            ImgList.push(img)
            //图片加载完后，将其显示在canvas中
            ImgList[i].onload = function(){
                ctx.save()
                ctx.beginPath()
                // ctx.fontSize=12
                ctx.fillStyle='#FF3500'
                // ctx.textAlign='center'
                ctx.textBaseline='middle'
                ctx.font="14px Arial";
                ctx.translate(200, 200);//将原点移至圆形圆心位置
                //旋转文字，从 i 开始，因为扇形是从数学意义上的第四象限第一个开始的，
                //文字目前的位置是在圆心正上方，
                //所以起始位置要将其旋转2个扇形的角度让其与第一个扇形的位置一致。
                ctx.rotate((angle * (i)) * Math.PI / 180);
                ctx.drawImage(this, 7, -(w * 0.55),52,52)
                ctx.fillText(ShangData[i].prizeName, 17, -(w * 0.57));
                ctx.restore();//保存绘图上下文，使上一个绘制的扇形保存住。
            }
        }
    }
    // 点击转动
    $('.turnplatw_btn').click(function(){
        if(last_prize.frequency > 0){
            onrotate()
            $('.turnplatw_btn').removeAttr("disabled", true);
            setTimeout(function () {
                $('.turnplatw_btn').removeAttr("disabled", true);
            }, 3000);
        }else{
            
        $('.showS>.bg>img').attr('src','https://files.alexhchu.com/2020/09/14/8a7d4913709f9.png')
        $('.showS>.bg>p').text("你没有次数了就不要点了！")
        $('.showS>.bg').css('background','url("https://7.dusays.com/2020/09/17/61a4b7efe8be2.png")no-repeat')
        $('.showS>.bg').css('background-size','100% 100%')
        $('.showS').show()
        $('.meng').show()

        }
    })
    //旋转
    function onrotate(){
        // 总角度
        var general_angle = 0
        var sector = canvas[0].getContext("2d");
        var time = 3000;
		var a0 = (Math.random()+5) / 100;
		var clock = 20;
		var interval = setInterval(function () {
            sector.save()
			var a = time >= 1500 ? a0:-a0;
			var v = time >= 1500 ? a * (3000-time) : a0*1500 + a * (1500-time);
			sector.translate(200,200);
			sector.rotate(Math.PI/180 * v);
			sector.translate(-200,-200);
            sector.clearRect(0,0,400,400);
			// 画外圈
            four_circular();
            // 内部扇形
            fan_piece(8,150);
            img(shangpinList)
            time -= clock;   
            general_angle +=  v
			if(time == 0){
                // 剩余的角度 
                var residual_degree = general_angle -  360 * Math.floor(general_angle/360)
                // 传递 到奖品公布
                publish_prize(residual_degree/45,shangpinList)
                // console.log
                // sector.restore()
                window.clearInterval(interval);
            }
        },clock)
    }
    // 传递 一个 剩余角度
    //一个商品列表
    function publish_prize(a,list){
        var reList = list.reverse()
		// 判断是不是第一次
		if(last_prize.ption == -1){
			last_prize.ption = a
            showS(reList[ Math.floor(a)])
		}else{
			// 第二次或更多转
			//临时列表
			var temporary_list = []
			// 重新排序列表
			for(var i = Math.floor(last_prize.ption);i<8;i++){
                temporary_list.push(reList[i])
			}
			for(var i = 0 ;i< Math.ceil(last_prize.ption);i++){
                temporary_list.push(reList[i])
			}
			temporary_list = temporary_list.reverse()
			var chulia =  parseInt(last_prize.ption *Math.pow(10,3)+0.5,10)/Math.pow(10,3) - Math.floor(last_prize.ption); 
			var enff = a + chulia
			var llll = Math.floor(enff)
			// 将临时列表存到全局变量
			last_prize.list = temporary_list.reverse()
			last_prize.ption = a
            // 传递商品参数
            showS(temporary_list[llll])
		}
    }
    //将商品展示出来
    function showS(list){
        // 商品的对象
        console.log(list)
        last_prize.frequency -= 1;
        $('.frequency p>span').text(last_prize.frequency)
        $('.showS>.bg>img').attr('src',list.prizeImg)
        $('.showS>.bg>p').text(list.prizeName)
        setTimeout(function(){
            $('.showS').show()
            $('.meng').show()
        },500);

        // 发送抽奖结果
        var userPhone = $('.loginText').val()
        var settings = {
            "url": "http://localhost:3000/function/lottery",
            "method": "POST",
            "timeout": 0,
            "data": {
                "phone": userPhone,
                "praze":list,
            }
        };
        $.ajax(settings).done(function (response) {
            
        });
    }
    $('.onCbu').click(function(e){
        $('.showS').hide()
        $('.meng').hide()
    })

    // 获取验证码
    $('.obtain_code').click(function(e){
        var userIphone = $('input[name="phone"]').val()
        if(userIphone){
            bnon();
            var settings = {
                "url": "http://localhost:3000/user/SendSms",
                "method": "POST",
                "timeout": 0,
                "data": {
                    "phone": userIphone
                }
            }; 
            $.ajax(settings).done(function (response) {
                console.log(response.data.msg_id);
                $(".msg_id").attr("value",response.data.msg_id)
            });
        }else{
            alert('不写手机号我给谁发？')
        }
    })
    function bnon(){
        var i = 30;
        setInterval(function () { 
            $('.obtain_code').text("请稍等"+i+"秒")
            i-=1;
        }, 1000); 
    }

    $('.onlogin').click(function(e){
        var phone = $('input[name="phone"]').val()
        var vcode = $('input[name="vcode"]').val()
        var vcodeID = $('input[name="msg_id"]').val()  
        if(phone !== ''&& vcode !== ''&&phone.length == 11&&vcode.length == 6){
            var settings = {
                "url": "http://localhost:3000/user/addUser",
                "method": "POST",
                "timeout": 0,
                "data": {
                    "vcode": vcode,
                    "mobile": phone,
                    "vcodeID": vcodeID
                }
            };
            $.ajax(settings).done(function (response) {
                console.log(response);
                $('.land').hide()
                $('.loginText').text(response.data.iphone)
                last_prize.frequency = response.data.count
                $('.frequency p span').text(response.data.count)
            });
        }else{
            alert('验证码错误')
        }
    })
    $('.loginText').click(function(){
        $('.land').show()
    })
    $('.onle').click(function(){
        $('.land').hide()
    })

})