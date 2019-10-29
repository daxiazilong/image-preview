// JavaScript Document

$(function(){
				$("#bacon").hide();
				$("#front").mouseenter(function(){
				$("#bacon").css("z-index","2");
				$("#bacon").slideDown(2000);
										});
				$("#bacon").mouseleave(function(e){
				$("#bacon").slideUp(2000);
				$("#front").css("visibility","visible");
				$("#front").css("z-index","1")
				e.stopPropagation();
								}
											)
				$(".items .box").find(".box").each(
				function(index){
						$(this).mouseover(function(){
								$(this ).find(".Trangle").css("border-top","8px solid #e21712");
							})
					}
				)
				$(".items").delegate(".box","mouseenter",function(){
					 $(this).find(".Trangle").css("border-top","8px solid #e21712");
					}
						)
				$(".items").delegate(".box","mouseout",function(){
					 $(this).find(".Trangle").css("border-top","8px solid #ffc908");
					}
						);

				/*nav lazy load begin*/
				$("#nav1").click(
				function(){
					$("html,body").animate({scrollTop:$("#about").offset().top},500);
					}
				  );
				$("#nav2").click(
				function(){
					$("html,body").animate({scrollTop:$("#s_project").offset().top},500);
					}
				  );
				$("#nav3").click(
				function(){
					$("html,body").animate({scrollTop:$("#tournament").offset().top},500);
					}
				  )
				$("#nav4").click(
				function(){
					$("html,body").animate({scrollTop:$("#stuff").offset().top},500);
					}
				  )
				$("#nav5").click(
				function(){
					$("html,body").animate({scrollTop:$("#mod_player").offset().top},500);
					}
				  )
				$("#nav6").click(
				function(){
					$("html,body").animate({scrollTop:$("#combo").offset().top},500);
					}
				  )
				$("#nav7").click(
				function(){
					$("html,body").animate({scrollTop:$("#contact_us").offset().top},500);
					}
				  )
				/*nav lazy load end*/

				/*返回顶部start*/
				$(document).scroll(function(){
					if($(window).scrollTop()>1000)
						$(".back_top").css("display","block");
					else
						$(".back_top").css("display","");
				})
				$(".back_top").click(function(){
					$("html,body").animate({scrollTop:0},500);
				})
				/*返回顶部 end*/





													}
)





