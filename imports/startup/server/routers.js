import { Router } from 'meteor/iron:router';
import fs from 'fs';


Router.route('/download', function () {
    const title = "ADE7953_1.0.0_Luat_V0027_8955.bin";
    const headers = {
      'Content-type': 'application/octet-stream',
      'Content-Disposition': 'attachment; filename=' + title
    };
    const filepath = Assets.absoluteFilePath(title);
    this.response.writeHead(200, headers);
    this.response.end(fs.readFileSync(filepath));
  },{where: 'server'});

Router.route('/upload/OTA', function () {
    if (this.request){
        console.log(this.request);
    //     const uploadpath = "/home/wangziguan/wzg/";
    //     const filename = uploadpath + "1.bin";
    //     const uploadfile = this.request.files[0]
    //     fs.writeFile(filename, uploadfile, function(err){
    //         if (err) throw err ;
    //         console.log("File Saved !"); 
    //     });
    };
    this.response.writeHead(200);
    this.response.end();
},{where: 'server'});  
   