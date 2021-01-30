// JavaScript Document
window.onload=function(){
		 

			//banner 开始
			var up=document.querySelector('#up .click-bear');
			var down=document.querySelector('#down .click-bear');
			var banner=document.querySelector('.stage-area');
			var deg=60;
	
			var y= 1;//rotateY(a)函数功能等同于rotate3d(0,1,0,a)
			var ndeg= 0;
			var count=0;
			var stagearea=document.getElementsByClassName("stage-area")[0];
			var bannertimer;
			var animate=false;
			var sproject=["极限冲浪","非常时刻","巅峰车技","极限蹦极","非常冲浪"];
			var sname=document.getElementById("sname")


			up.addEventListener("click",function(e){
				if( animate ) return;
				animate = true;
				e.stopPropagation();
				var orign=window.getComputedStyle(banner,null).transform;
				var suber=orign.slice(9,orign.length-1);//这两个旋转方向他们之间的差值只要为60就好，只要 有60的差值就会旋转

				ndeg=(ndeg+60);
				banner.style.transform=" rotateY(" + ndeg+"deg)";
				sname.innerHTML=sproject[++count];
				if(count==4)
					count=0;

				setTimeout(function(){
					animate=false;

				},1200)

				},
				true
			)

			up.addEventListener("mouseenter",function(){
				clearInterval(bannertimer);
				animate=false;
			})

			function downTo(e){
				e && e.stopPropagation();
				if(animate)
					return;
				animate=true;

				ndeg-=60;

				banner.style.transform=" rotateY("+ndeg+"deg)";
				if(count==0){
					count=4;
					sname.innerHTML=sproject[count];
					count--;
				}else{
					sname.innerHTML=sproject[--count];

				}
				setTimeout(function(){
					animate=false;

				},1200)
				//alert("deg和ndeg的值是："+deg+"  "+ndeg);
			}

			function rotate(){
				bannertimer=setInterval(downTo, 3000)
			}
			rotate();
			stagearea.onmouseenter=function(){
				clearInterval(bannertimer);
			}
			stagearea.onmouseout=function(ev){
				var oEvent=ev||event;                                                                        　
				var oTo=oEvent.toElement||oEvent.relatedTarget;
				if(this.contains(oTo))
					rotate();
			}
			down.addEventListener("click",downTo,true)//banner 上下箭头点击事件
			down.addEventListener("mouseenter",function(){
				clearInterval(bannertimer)
				animate=false;
			})
				var Circle=document.querySelectorAll("#Cgroup li")

				function liActive(){
					for(var n=0;n<Circle.lengrh;n++)
						Circle[n].className="";
					
					var curInddex = Math.abs(( ndeg % 360 ) / 60)
					console.log( this.index , curInddex )
					var gap = Math.abs(this.index - curInddex) * 60;


					ndeg += gap;

					banner.style.transform=" rotateY("+ ndeg + "deg)";
					this.className="li_active";
				}

				for(var i=0;i<Circle.length;i++){
					Circle[i].onclick=liActive;
					Circle[i].index=i;
				}//banner 结束



					var t=document.getElementById("takeTurns").getElementsByClassName("image");
					var timer;
					var  turnsmark=false;
					function turns(c){
						if(turnsmark)
							return;
							turnsmark=true;
						var i=c||1;
						t[i].style.opacity=1;
						t[i].getElementsByClassName("front")[0].style.display="block";
						var n=i;
						switch(i){
							case 1:i+=1;
										break;
							case 2:i+=4;
										break;
							case 6:i-=1;
										break;
							case 5:i=1;
							default:break;
							}
						timer=setTimeout(function(){
							turnsmark=false;
							turns(i);
							t[n].style.opacity=0.5;
							t[n].getElementsByClassName("front")[0].style.display="none";
							t[n].removeAttribute("style");
							t[n].getElementsByClassName("front")[0].removeAttribute("style")
						},2000);
								}
					function stopturns(){
							if(!turnsmark)
								return;
							clearTimeout(timer);
							turnsmark=false;
						}
					document.getElementById("takeTurns").onmouseenter=function(){
						stopturns();
						}
					document.getElementById("takeTurns").onmouseout=function(ev){
						 var oEvent=ev||event;                                      //oEvent.fromElement(从哪里来的元素)：兼容IE,Chrome
						 															//oEvent.toElement(去哪里的元素)：兼容IE,Chrome

　　　　　　                                                                          //oEvent.relateTarget(相关元素)：兼容FF　
						var oTo=oEvent.toElement||oEvent.relatedTarget;
																					//其中oEvent.toElement兼容IE，chrome
																					//oEvent.relatedTarget;兼容FF。
						if(this.contains(oTo))
							return;
									turns();
						}

					//turns();//图片轮流顺时针显示部分




		function countdown(){
			var d=document.getElementById("day");
			var h=document.getElementById("h");
			var m=document.getElementById("m");
			var s=document.getElementById("s");
			setInterval(function(){
				var date=new Date();
					d.innerHTML=25-date.getDate();
					h.innerHTML=23-date.getHours();
					m.innerHTML=59-date.getMinutes();
					s.innerHTML=59-date.getSeconds();
			},1000)

		}
			countdown();	//赛事倒计时部分


	/*widget hover效果 start */
	var widget=document.getElementsByClassName("widget")[0].getElementsByTagName("div");
	!(function(){
		for(var i=0,l=widget.length;i<l;i++){
			widget[i].index=i;
			widget[i].onmouseenter=function(){
				var s=this.getElementsByTagName("img")[0].src;
				this.getElementsByTagName("img")[0].src=s.replace(/_w/,'_b');
				this.style.background="#ffc908";
				}
			widget[i].onmouseout=function(ev){
				var e=ev||event;
				var oto=e.toElement||e.relatedTarget;
				if(this.contains(oto))
					return;
				var s=this.getElementsByTagName("img")[0].src;
				this.getElementsByTagName("img")[0].src=s.replace(/_b/,'_w');
				this.style.background="#000";
				}
			}
		}
	)(); //立即执行函数小括号不能丢！！！
	/*widget hover效果 end*/

	/*qq视频插件 start*/
	var vPlay=document.getElementById("v_control");
	vPlay.onclick=function(){
	var v=document.createElement('script');
	var video = new tvp.VideoInfo();
	video.setVid("g0014dvzsfj");
	var player =new tvp.Player();
	player.create({
					width:"100%",
					height:900,
					video:video,
					modId:"mod_player",
					margin:"0 auto",
					autoplay:false,
					poster:"images/video.jpg",
	})
								};
	/* end*/

/*返回顶部active动画开始*/
var back_top=document.getElementsByClassName("back_top")[0];
var fTimer;
function fire(){
	var i=0;
	var th=this;
	//var h=window.scrollTop;
	//alert(h)
	fTimer=setInterval(function(){
		th.style.boxShadow="5px "+"10px "+"19px "+100*Math.sin(i)+"px "+"#e21712";
		i+=0.1
	},30)
}
function sfire(){
	clearInterval(fTimer);
	this.removeAttribute("style")
}
back_top.addEventListener("mousedown", fire)
back_top.addEventListener("mouseup", sfire)

/*返回顶部active动画结束*/





}
