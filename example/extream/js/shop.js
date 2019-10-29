/*
* @Author: Administrator
* @Date:   2016-12-19 11:10:04
* @Last Modified by:   feng sky
* @Last Modified time: 2016-12-29 08:49:55
*/
window.onload=function(){

	/*购物车弹出及购物车*/
	!(function(){
		var c=document.getElementById("cart");
		var cover=document.createElement("div");
		var Cart=document.getElementById("Cart");
		var wrong=document.getElementsByClassName("wrong");
		var discount=document.getElementById("discount");
		var total=document.getElementById("total");
		var count=document.getElementById("count")

		cover.style.width=document.body.clientWidth+"px";
		cover.style.height=document.body.clientHeight+"px";
		cover.className="decoration";
		c.addEventListener("click",fCover,false);
		//if()
		cover.addEventListener("click", move_cart);
		function fCover(){
			document.body.appendChild(cover);
			Cart.style.display="block";
			//window.scrollHanlder.disableScroll();

		}
		function move_cart(){
			cover.parentNode.removeChild(cover);
			Cart.style.display="none";
			window.scrollHanlder.enableScroll();
		}

		for(var i=0;i<wrong.length;i++)
			wrong[i].onclick=function(){
				this.style.boxShadow="1px 1px 5px 1px #e24177";
				var tthis=this;
				setTimeout(function(){tthis.parentNode.parentNode.parentNode.parentNode.removeChild(tthis.parentNode.parentNode.parentNode);
							if(wrong.length==0){
								discount.innerHTML=0;
								total.innerHTML=0;
							}
							count.innerHTML=wrong.length;
				}, 500);

			}



	}
		)()
/*购物车结束*/

	/* nav widget src替换*/
	!(function(){
		var nBox=document.getElementById("nav_widget").getElementsByClassName("box");
		for(var i=0,l=nBox.length;i<l;i++){
			nBox[i].onmouseenter=function(){
				this.getElementsByTagName("img")[0].src=this.getElementsByTagName("img")[0].src.replace(/_b/, '_w');
			}
			nBox[i].onmouseout=function(ev){
				var e=ev||event;
				var oto=e.toElement||e.relatedTarget;
				if(this.contains(oto))
					return;
				this.getElementsByTagName("img")[0].src=this.getElementsByTagName("img")[0].src.replace(/_w/, '_b');
			}
		}
	})()


/* margin动画 */
	!(function(){
		var triangle=document.getElementById("retriangle");
		var reBtn=document.getElementById("re_button");
		window.onscroll=function(){
			var scrollTop = window.pageYOffset|| document.documentElement.scrollTop || document.body.scrollTop;
			if(document.getElementsByClassName("decoration")[0])
				window.scrollHanlder.disableScroll();
			//alert(document.getElementsByClassName("decoration")[0])
			if(scrollTop>(triangle.offsetTop-671)&&scrollTop<(triangle.offsetTop-671+document.getElementById("welcome").offsetTop))
				reBtn.style.marginLeft=5+"px";
			else
				reBtn.style.marginLeft=226+"px";
		}
	}
		)()
/*margin动画结束 */

/*分类选项卡开始*/
 !(function(){
	var t=document.getElementsByClassName("f_group")[0].getElementsByClassName("box");
	var c=document.getElementsByClassName("category")[0].getElementsByClassName("cc");
		for(var i=0;i<t.length;i++){
			t[i].index=i;
			t[i].onclick=function(){
				for(var n=0;n<t.length;n++)
					t[n].id="";
					this.id="f_active"
				for(var m=0;m<c.length;m++)
					c[m].style.display="none"
					c[this.index].style.display="block";
			}
		}
})()
/*分类选项卡结束*/

/*加入购物车算法开始*/
var Cart=document.getElementById("Cart");
var bottom=document.getElementById("bottom");
var purchase=document.getElementsByClassName("purchase")
function Goods(tagname,classname,innerhtml){
	 var a=document.createElement(tagname);
	a.className=classname;
	a.innerHTML=innerhtml
	return a;
}
function Img(src,classname){
	var a=document.createElement("img");
	a.src=src
	;
	a.className=classname;
	return a;
}
function addGoods(){
	var count=document.getElementById("count")
	var wrong=document.getElementsByClassName("wrong")
	var c_goods=Goods("div","top","");
	var img=Img(this.parentNode.getElementsByTagName("img")[0].src,"");
	var c_left=Goods("div","left","")
	var c_right=Goods("div","right","")
	c_goods.appendChild(c_left);
	c_goods.appendChild(c_right);
	c_left.appendChild(img);
	var right_h1= Goods("h1",'',this.parentNode.getElementsByTagName("p")[0].innerHTML);
	var h1_img=Img("s_images/wrong.png","wrong")
	right_h1.appendChild(h1_img);
	var right_h2=new Goods("h2","",this.parentNode.getElementsByTagName("button")[0].innerHTML);
	var right_h3=new Goods("h3","","数量:")
	var h3_span=new Goods("span",'',1);
	right_h3.appendChild(h3_span);
	c_right.appendChild(right_h1);
	c_right.appendChild(right_h2);
	c_right.appendChild(right_h3)
	Cart.insertBefore(c_goods, bottom);
	for(var i=0;i<wrong.length;i++)
		wrong[i].onclick=function(){
			this.style.boxShadow="1px 1px 5px 1px #e24177";
			tthis=this;
			setTimeout(function(){tthis.parentNode.parentNode.parentNode.parentNode.removeChild(tthis.parentNode.parentNode.parentNode);
										if(wrong.length==0){
											discount.innerHTML=0;
											total.innerHTML=0;
										}
										count.innerHTML=wrong.length;
							}, 500);
		}
		count.innerHTML=wrong.length;
		showMsg(this);
}
!function(){
	for(var i=0,l=purchase.length;i<l;i++)
		purchase[i].addEventListener("click", addGoods)
}()

function showMsg(a){//添加成功提示信息
	var s=document.createElement("span");
	s.id="showMsg";
	s.innerHTML="添加成功！";
	a.appendChild(s)
	setTimeout(function(){
		s.style.opacity=0;
		s.style.left=100+"%";
		s.style.top=100+"%";
	}, 600)
	setTimeout(function(){
		s.parentNode.removeChild(s)
	},1100 )
}
/*加入购物车结束*/

/*返回顶部开始*/
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
/*返回顶部结束*/


}
