$(function(){
    //console.log($)

    function fn(){
        $.ajax({
            url:'/getData',
            type:'get',
            success:function(allData){
                console.log(allData);

                allData.forEach((ele,index)=>{
                    var id =ele.id;
                    var date =ele.date;
                    var emotion =ele.emotion;

                    var list =`<tr>
                                <td>${id}</td>
                                <td>${date}</td>
                                <td>${emotion}</td>
                                <td><button type="button" class="btn btn-info">查看</button></td>
                               </tr>`;
                    $("tbody").append(list);
                })
            },
            error:function(err){
                console.log(err)
            }
        })
    }
    fn();

    //点击添加日记按钮 增加数据
    $("#submit").click(function(){

        var json ={
            title:$("#title").val(),
            emotion:$("#emotion").val(),
            content:$("#content").val()
        };

        $.ajax({
            url:'/add',
            type:'post',
            data:json,
            success:function(data){
                if(data.state==='ok'){
                    alert(data.message);
                }

                $("tbody").text('');
                fn();
            },
            error:function(err){
                console.log(err);
            }
        })
    })

    //点击查看按钮 弹出模态框

    $("tbody").on("click","button",function(){
        var id=$(this).parent().parent().find('button').text();//获取到查看按钮的id
        //console.log(id)
        $.ajax({
            url:'/getone',
            type:'get',
            data:{id:id},
            success:function(data){
                if(data.state==='ok'){
                    var newMoudel =$(`<div class="modal fade" tabindex="-1" role="dialog" id="myModal">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                    <h4 class="modal-title">${content.date}日记--心情：${content.emotion}--天气：${content.weather}</h4>
                </div>
                <div class="modal-body">
                    <p>One fine body&hellip;</p>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
                </div>
            </div><!-- /.modal-content -->
        </div><!-- /.modal-dialog -->
    </div>`)
                    $('body').append(newMoudel);
                    //$('#myModal').modal({show:true})
                }
            },
            error:function(err){
                console.log(err);
            }
        })
    })













})