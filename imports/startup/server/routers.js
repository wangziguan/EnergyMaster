import { Router } from 'meteor/iron:router';
var fs = Npm.require('fs');

Router.route('/update', function(){
    var req = this.request;
    var res = this.response;

    // var filePath = '/home/wzg/wzg/meteor/EnergyMaster/public/ADE7953_1.0.0_Luat_V0027_8955.bin';
    var filePath = 'ADE7953_1.0.0_Luat_V0027_8955.bin';
    var buf = Assets.getText(filePath)

    res.writeHeader(200,{
        "Content-Type":"application/octet-stream",
        'Content-Disposition': 'inline',
        // 'Content-Size': fileSize
    });
    res.write(buf);
    res.end()
    },{where:'server'});