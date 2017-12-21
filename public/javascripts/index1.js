$(document).ready(function(){
    let dataArr =[];
    let _title ='';
    let _content ='';
    let _emotion ='';


    // 开启页面的时候获取所有日记渲染表格，需要动态生成tr标签与td标签

    //获取数据库所有数据
    let getAllData =()=>{
        let p= new Promise((resove,reject)=>{
            $.ajax({
                url:'/getData',
                type:'get',
                success:function(data){
                    resove(data);
                }
            })
        });
        return p;
    };

    //创建dom
    let creatDom =(allData)=>{
        dataArr =allData;
        allData.map((item,index)=>{
          let newDom =$(`
                <tr>
                    <td>${item.id}</td>
                    <td>${item.date}</td>
                    <td>${item.emotion}</td>
                    <td><button type="button" class="btn btn-info" index=${index}>查看</button></td>
                </tr>
          `);
            $("tbody").append(newDom);
        })

    };

    getAllData()
        .then((data)=>{
            creatDom(data);
        })

    //查看
    let showData =(content)=>{
        $("#myModal").remove();
        console.log(content);
        let newMoudel =$(`<div class="modal fade" tabindex="-1" role="dialog" id="myModal">
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
        $('#myModal').modal({show:true})
    };

    $("tbody").click((e)=>{
       if(e.target.classList.contains("btn")){
           //console.log($(e.target).attr('index'))
           let num =parseInt($(e.target).attr('index'),10);
           let content =dataArr[num]; //获取一条数据信息
           showData(content);
       }
        return true;
    });


    $("#submit").click(()=>{

        insetData()
            .then((data)=>{
                let newObj ={
                    id:11,
                    title:_title,
                    emotion:_emotion,
                    date:11,
                    content:_content,
                    weather:'lalal'
                }
                dataArr.push(newObj);
            })
    })


    $("#title").change((e)=>{
       _title =e.target.value;
    })



    let insetData =()=>{
        let p =new Promise((resove,reject)=>{
            let tmpData ={
                id:11,
                title:_title,
                emotion:_emotion,
                date:11,
                content:_content,
                weather:'lalal'
            };
            $.ajax({
                url:'/add',
                type:'post',
                data:tmpData,
                success:(data)=>{
                    resove(data)
                }

            })
        });
        return p;
    }









        // 点击添加按钮添加日记并更新列表

        // 点击查看，蹦出模态框展示日记


});









//
//$.ajax({
//    url:'/add',
//    type:'post',
//    success:function(data){
//        console.log(data);
//
//        data.forEach((ele,index)=>{
//
//            var id=ele.id;
//            var emotion =ele.emotion;
//            var data=ele.date;
//            var list =` <tr class="">
//                                    <th scope="row">${id}</th>
//                                    <td>${data}</td>
//                                    <td class="single">${emotion}</td>
//                                    <td>
//                                      <button type="button" class="btn btn-info removeData">查看</button>
//                                    </td>
//                                  </tr>`;
//            $("#box").append(list);
//
//        })
//    },
//    error:function(err){
//        console.log(err);
//    }
