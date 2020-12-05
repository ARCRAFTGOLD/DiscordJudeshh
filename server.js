const express = require("express");
const app = express();
const listener = app.listen(process.env.PORT);

app.get("/", (req, res) => {
  res.send(`OK`);
});

//////////////////////////////////////////////////////////////

const { Client, MessageEmbed } = require("discord.js");
const client = new Client({ disableEveryone: true });

client.login("NzgzOTI2MTM5NTQyMzA2ODM2.X8h2HA.xOmc4R-PD2lp8MV9ozX81JaFdFk");
client.on("ready", () => {
  console.log(`ON!`);
  client.user.setStatus("idle");
  client.user.setActivity("Judes");
});

//////////////////////////////////////////////////////////////

const fs = require("fs");

//////////////////////////////////////////////////////////////

const MongoClient = require("./MongoSimpleClient/index.js");
const db = new MongoClient(
  "mongodb+srv://Main_DB_GroupBot:yCKSUKbd31pnQD1m@groupb.yolrs.mongodb.net/",
  "GroupBot"
);
const con = JSON.parse(fs.readFileSync("./config.json", "utf8"));

//////////////////////////////////////////////////////////////

let prefix = "-";

//////////////////////////////////////////////////////////////

const linkserver = "https://discord.gg/ePUEzgtCvZ"; // رابط دعوة سيرفرك
const serverid = "783349647841558568"; // ايدي سيرفر
const idchannel = "783827656629026836"; // ايدي روم الي تجي عليه تقديمات!
const idchannel2 = "783745353353920513"; // ايدي روم الي لم تنقبل يجي عليه "لاشخاص"
const idchannel3 = "783745393414111284"; // ايدي روم الي لم تنقبل يجي عليه "سيرفرات"
const roleaccept = "783825606306824194"; // ايدي رتبة الي تقبل التقديمات

//////////////////////////////////////////////////////////////
client.on("message", message => {
	if (message.author.bot || !message.guild) return;
  if (message.content.startsWith(prefix + "help")) {
    let helpable = 0;
    message.author
      .send(``)
      .catch(e => {
        helpable = 1;
        return message.react(`🟥`).catch(e => {
          message.channel.send("no permissions!");
        });
      })
      .then(m => {
        if (helpable === 0) {
          message.author.send("");
          return message.react(`🟩`).catch(e => {
            message.channel.send("no perms");
          });
        }
      });
  }
});

//////////////////////////////////////////////////////////////
client.on("message", message => {
  var args1 = message.content.split(" ")[1];
	if (message.author.bot || !message.guild) return;
  if (message.content.startsWith(prefix + "accept-user")) {
    const role = message.guild
      .member(message.author)
      .roles.cache.get(roleaccept);
    if (!role) return message.channel.send(`لا تسطيع قبول / رفوض التقديمات !`);
    db.get("users", { nu: args1 }).then(rows => {
      if (rows.length < 1) return message.channel.send(`Can't find this!`);
      const channel = client.channels.cache.get(idchannel);
      const channela = client.channels.cache.get(idchannel2);
      channel.messages.fetch(rows[0].messageid).then(async msg => {
        var reported = client.users.cache.get(rows[0].reported);
        var users = client.users.cache.get(rows[0].user);
        if (!reported) {
          msg.edit(`
معلومات نصاب 
الايدي : ${rows[0].reported}
الاسم بالتاق : Invalid User
معلومات صاحب البلاغ
الايدي : ${rows[0].user}
الاسم بالتاق : ${rows[0].usertag}
القضية : ${rows[0].message}
الرقم: ${rows[0].nu}
تم قبول من قبل ${message.author}

الي كتب الامر: ${rows[0].idby}
القضية: ${rows[0].nu}
تم قبول بوسط: ${message.author.id}
`);
          channela
            .send(
              `
معلومات نصاب 
الايدي : ${rows[0].reported}
معلومات صاحب البلاغ
الايدي : ${rows[0].user}
الاسم بالتاق : ${rows[0].usertag}
القضية : ${rows[0].message}
الرقم: ${rows[0].nu}
يرجي من مسؤول باند حظره : <@&783825744404283402>
`)
            
            .then(gg => {
              rows[0].messageid = gg.id;
              db.update("users", { nu: rows[0].nu }, rows[0]);
            });
          for (const data of rows) {
            data.accept = "true";
            db.update("users", { user: data.user }, data);
          }
          return message.channel.send(`Done!`);
        }
        msg.edit(`
معلومات نصاب 
ايدي النصاب : ${rows[0].reported}
تاق النصاب : ${reported.tag}
معلومات صاحب البلاغ
ايدي المنصوب عليه : ${rows[0].user}
تاق المنصوب عليه : ${rows[0].usertag}

الي كتب الامر: ${rows[0].idby}
الرقم: ${rows[0].nu}
تم قبول بوسط: ${message.author.id}
`
          )
        channela.send(`
معلومات النصاب
ايدي النصاب: ${rows[0].reported}
تاق النصاب: ${reported.tag}
معلومات صاحب اابلاغ
ايدي المنصوب عليه: ${rows[0].user}
تاق المنصوب عليه: ${rows[0].usertag}`)
          .then(gg => {
            rows[0].messageid = gg.id;
            db.update("users", { nu: rows[0].nu }, rows[0]);
          });
        reported.send(`تم قبول القضية رقم: ${rows[0].nu}

يرجي من مسؤول باند حظره : <@&783825744404283402<`);
        for (const data of rows) {
          data.accept = "true";
          db.update("users", { user: data.user }, data);
        }
        return message.channel.send(`Done!`);
      });
    });
  }
});

//////////////////////////////////////////////////////////////
client.on("message", message => {
const messl = new MessageEmbed()
.setTitle('لا يوجد اي قضايا مرفوعة علي هذا الشخص')
  var args2 = message.content.split(" ")[2];
	if (message.author.bot || !message.guild) return;
  if (message.content.startsWith(prefix + "check-server on")) {
    if (!args2)
      return message.channel.send(`use: ${prefix}check-user on [id or code]`);
    db.get("servers", { user: args2 }).then(rows => {
      if (rows.length < 1)
        return message.channel.send(messl);
      let numbers = ``;
      for (const data of rows) {
        console.log(data.nu);
        if (data.accept === "false")
          numbers = numbers + `,${data.nu}\`no verified\` `;
        if (data.accept === "true") numbers = numbers + `,${data.nu}`;
      }
const hio = new MessageEmbed()
.setTitle('تحذير يوجد قضايا علي هذا السيرفر')
.setDescription('نحذرك يوجد قضايا علي هذا الخادم لا تثق فيه في حال دفع اعلانات غير ب وسيط و تثق ف هدايا الخاصة بيه و نظام الدعوات ايضا..')
.addField('رقم القضايا : ', `${numbers}`, true)
      return message.channel.send(hio);
        //`
// ${numbers}
//`);
    });
  }
});

//////////////////////////////////////////////////////////////

client.on("message", message => {
const messl = new MessageEmbed()
.setTitle('لا يوجد اي قضايا مرفوعة علي هذا الشخص')
  var args2 = message.content.split(" ")[2];
	if (message.author.bot || !message.guild) return;
  if (message.content.startsWith(prefix + "check-user on")) {
    if (!args2)
      return message.channel.send(`use: ${prefix}check-user on [id or code]`);
    db.get("users", { reported: args2 }).then(rows => {
      if (rows.length < 1)
        return message.channel.send(messl);
      let numbers = ``;
      for (const data of rows) {
        if (data.accept === "false") {numbers = numbers + `,${data.nu}\`no verified\` `}
        if (data.accept === "true") {numbers = numbers + `,${data.nu}`}
      }
const hio = new MessageEmbed()
.setTitle('تحذير يوجد قضايا علي هذا الشخص')
.setDescription('نحذرك من هذا شخص في حال عملية كانت شراء ننصحك بي حضار وسيط انت ويكون من ثقتك شخصية ومشهور, في حال كان هو وسيط قم بي الاغاء العملية علئ الفور!')
.addField('رقم القضايا : ', `${numbers}`, true)
      return message.channel.send(hio);
    });
  }
});

//////////////////////////////////////////////////////////////

client.on("message", message => {
  var args1 = message.content.split(" ")[1];
	if (message.author.bot || !message.guild) return;
  if (message.content.startsWith(prefix + "accept-server")) {
    const role = message.guild
      .member(message.author)
      .roles.cache.get(roleaccept);
    if (!role) return message.channel.send(`لا تسطيع قبول / رفوض التقديمات !`);
    db.get("servers", { nu: args1 }).then(rows => {
      if (rows.length < 1) return message.channel.send(`Can't find this!`);
      const channel = client.channels.cache.get(idchannel);
      const channela = client.channels.cache.get(idchannel3);
      channel.messages.fetch(rows[0].messageid).then(async msg => {
        var reported = client.users.cache.get(rows[0].reported);
        if (!reported) {
          msg.send(`
معلومات السيرفر النصاب 
الايدي : ${rows[0].user}
معلومات صاحب البلاغ
الايدي : ${rows[0].reported}
الاسم بالتاق : Invaild user or leave in guild

الي كتب الامر: ${rows[0].idby}
القضية : ${rows[0].message}
الرقم: ${rows[0].nu}
تم الفحص
`);
          channela
            .send(
              `
معلومات السيرفر نصاب 
الايدي : ${rows[0].user}
معلومات صاحب البلاغ
الايدي : ${rows[0].reported}
الاسم بالتاق : Invaild user or leave in guild

القضية : ${rows[0].message}
الرقم: ${rows[0].nu}
تم قبول من قبل ${message.author}
`
            )
            .then(gg => {
              rows[0].messageid = gg.id;
              db.update("servers", { nu: rows[0].nu }, rows[0]);
            });
          for (const data of rows) {
            data.accept = "true";
            db.update("servers", { user: data.user }, data);
          }
          return message.channel.send(`Done!`);
        }
        msg.edit(`
معلومات السيرفر النصاب 
الايدي : ${rows[0].user}
معلومات صاحب البلاغ
الايدي : ${rows[0].reported}
الاسم بالتاق : ${reported.tag}

الي كتب الامر: ${rows[0].idby}
القضية : ${rows[0].message}
الرقم: ${rows[0].nu}
تم قبول من قبل ${message.author}
`);
        channela
          .send(
            `
معلومات السيرفر نصاب 
الايدي : ${rows[0].user}
معلومات صاحب البلاغ
الايدي : ${reported.id}
الاسم بالتاق : ${reported.tag}

القضية : ${rows[0].message}
الرقم: ${rows[0].nu}
`
          )
          .then(gg => {
            rows[0].messageid = gg.id;
            db.update("servers", { nu: rows[0].nu }, rows[0]);
          });
        for (const data of rows) {
          data.accept = "true";
          db.update("servers", { user: data.user }, data);
        }
        reported.send(`تم قبول القضية رقم: ${rows[0].nu}`);
        return message.channel.send(`Done!`);
      });
    });
  }
});

//////////////////////////////////////////////////////////////

client.on("message", message => {
  var args1 = message.content.split(" ")[1];
  var args2 = message.content.split(" ")[2];
	if (message.author.bot || !message.guild) return;
  if (message.content.startsWith(prefix + "refusal-user")) {
    const role = message.guild
      .member(message.author)
      .roles.cache.get(roleaccept);
    if (!role) return message.channel.send(`لا تسطيع قبول / رفوض التقديمات !`);
    db.get("users", { nu: args1 }).then(rows => {
      if (rows.length < 1) return message.channel.send(`Can't find this!`);
      const channel = client.channels.cache.get(idchannel);
      channel.messages.fetch(rows[0].messageid).then(async msg => {
        var reported = client.users.cache.get(rows[0].reported);
        if (!reported) {
          msg.send(`
معلومات النصاب 
الايدي : ${rows[0].user}
الاسم النصاب : ${rows[0].usertag}
معلومات صاحب البلاغ
الايدي : ${rows[0].reported}
الاسم بالتاق : Invaild user or leave in guild

القضية : ${rows[0].message}
الرقم: ${rows[0].nu}
تم رفض من قبل ${message.author}
`);
          return message.channel.send(`Done!`);
        }
        msg.edit(`
معلومات النصاب 
الايدي : ${rows[0].user}
الاسم النصاب : ${rows[0].usertag}
معلومات صاحب البلاغ
الايدي : ${rows[0].reported}
الاسم بالتاق : ${reported.tag}

القضية : ${rows[0].message}
الرقم: ${rows[0].nu}
تم رفض من قبل ${message.author}
`);
        reported.send(`تم رفض قضيتك!

رقم: ${rows[0].nu}
السبب: ${args2}
`);
        return message.channel.send(`Done!`);
      });
    });
  }
});
//////////////////////////////////////////////////////////////

// اسمع وين معرفهم انت? var
client.on("message", message => {
  var args1 = message.content.split(" ")[1];
	if (message.author.bot || !message.guild) return;
  if (message.content.startsWith(prefix + "show-user")) {
    var guild = client.channels.cache.get(serverid);
    var user = guild.members.cache.get(message.author.id);
    if (!user) {
      message.channel.send("Join server supported!");
      message.author.send(`Linked: ${linkserver}`).catch(err =>{
message.channel.send("Linked: " + linkserver)
})
    } else {
      db.get("users", { nu: args1 }).then(rows => {
        if (rows.length < 1) return message.channel.send(`Can't find this!`);
        if (rows[0].accept === "false")
          return message.channel.send(`Can't find this!`);
        message.channel.send(`
<https://discordapp.com/channels/${serverid}/${idchannel2}/${rows[0].messageid}>
`);
      });
    }
  }
});

//////////////////////////////////////////////////////////////
// اسمع وين معرفهم انت? var
client.on("message", message => {
  var args1 = message.content.split(" ")[1];
	if (message.author.bot || !message.guild) return;
  if (message.content.startsWith(prefix + "show-server")) {
    var guild = client.guilds.cache.get(serverid);
    var user = guild.members.cache.get(message.author.id);
    if (!user) {
      message.channel.send("Join server supported!");
      message.author.send(`Linked: ${linkserver}`).catch(err =>{
message.channel.send("Linked: " + linkserver)
})
    } else {
      db.get("servers", { nu: args1 }).then(rows => {
        if (rows.length < 1) return message.channel.send(`Can't find this!`);
        if (rows[0].accept === "false")
          return message.channel.send(`Can't find this!`);
        message.channel.send(`
<https://discordapp.com/channels/${serverid}/${idchannel3}/${rows[0].messageid}>
`);
      });
    }
  }
});

//////////////////////////////////////////////////////////////

client.on("message", message => {
  var args1 = message.content.split(" ")[1];
	if (message.author.bot || !message.guild) return;
  var args2 = message.content.split(" ")[2];
  if (message.content.startsWith(prefix + "refusal-server")) {
    const role = message.guild
      .member(message.author)
      .roles.cache.get(roleaccept);
    if (!role) return message.channel.send(`لا تسطيع قبول / رفوض التقديمات !`);
    db.get("servers", { nu: args1 }).then(rows => {
      if (rows.length < 1) return message.channel.send(`Can't find this!`);
      const channel = client.channels.cache.get(idchannel);
      channel.messages.fetch(rows[0].messageid).then(async msg => {
        var reported = client.users.cache.get(rows[0].reported);
        if (!reported) {
          msg.send(`
معلومات السيرفر النصاب 
الايدي : ${rows[0].user}
الاسم : ${rows[0].usertag}
معلومات صاحب البلاغ
الايدي : ${rows[0].reported}
الاسم بالتاق : Invaild user or leave in guild

القضية : ${rows[0].message}
الرقم: ${rows[0].nu}
تم رفض من قبل ${message.author}
`);
          return message.channel.send(`Done!`);
        }
        msg.edit(`
معلومات السيرفر النصاب 
الايدي : ${rows[0].user}
الاسم : ${rows[0].usertag}
معلومات صاحب البلاغ
الايدي : ${rows[0].reported}
الاسم بالتاق : ${reported.tag}

القضية : ${rows[0].message}
الرقم: ${rows[0].nu}
تم رفض من قبل ${message.author}
`);
const reasontouser = new MessageEmbed()
.setColor('#0099ff')
.setTitle(`نعتذر تم رفض قضيتك رقم : ${rows[0].nu}`)
        reported.send(reasontouser)//`تم رفض قضيتك!

          
//: ${rows[0].nu}
// ${args2}
        return message.channel.send(`Done!`);
      });
    });
  }
});

//////////////////////////////////////////////////////////////
const Report1 = new MessageEmbed()
.setColor('#0099ff')
.setTitle('يرجي تحديد نوع النصاب')
.addField('<:usericon:784315389173563393> - Type `user`', 'اذا كان النصاب شخص او حساب غير تابع لأي سيرفر', true)
.addField('<:servericon:784315269643370496> - Type `server`', 'اذا كان النصاب سيرفر مثال : اعلان ، قيف ، ريوارد', true)
const fieldchoose = new MessageEmbed()
.setColor('#0099ff')
.setTitle('خطأ في الاختيار')
client.on("message", message => {
  var cmd2 = message.content.split(" ")[1];
	if (message.author.bot || !message.guild) return;
                                const channel = client.channels.cache.get(
                                idchannel
                              );
  if (message.content.startsWith(prefix + "report")) {
    message.channel.send(Report1).then(m => {
      message.channel
        .awaitMessages(m => m.author.id === message.author.id, { max: 1 })
        .then(c => {
          if (c.first().content !== "server" && c.first().content !== "user")
            return message.channel.send(
              `\`Failed\`, Auto Failed, Reason: "server or user only"`
            );
          message.channel
            .send(`**<:Thieficon:784334339227648040> - Enter ${c.first().content} id - يرجي كتابة ايدي النصاب**`)
            .then(a => {
              message.channel
                .awaitMessages(a => a.author.id === message.author.id, {
                  max: 1
                })
                .then(g => {
                  message.channel.send(`<:usericon:784315389173563393> - ايدي المنصوب عليه`).then(s => {
                    message.channel
                      .awaitMessages(h => h.author.id === message.author.id, {
                        max: 1
                      })
                      .then(f => {
                        message.channel.send(`يرجي كتابة القضية مع جميع دلايل : دليل سحبة او بلوك ، دليل تحويل`).then(h => {
                          message.channel
                            .awaitMessages(
                              h => h.author.id === message.author.id,
                              { max: 1 }
                            )
                            .then(v => {
                              if (c.first().content === "user") {
                                var al = `${v.first().content}`;
                                con["nu-users"] = con["nu-users"] + 1;
                                fs.writeFile(
                                  `./config.json`,
                                  JSON.stringify(con, null, 5),
                                  function(err) {
                                    if (err) console.log(err);
                                  }
                                );
                                var reporteds = client.users.cache.get(
                                  g.first().content
                                );
                                var reported = client.users.cache.get(
                                  f.first().content
                                );
                                if (!reported)
                                  return message.channel.send(
                                    "الايدي خطأ يرجي التأكد..."
                                  );
                                if (!reporteds) reporteds = "User Has invaild!";

                                channel
                                  .send(
                                    `
                                    <@&783825606306824194> 
معلومات النصاب 
الايدي النصاب : ${g.first().content}
تاق النصاب : ${reporteds.tag}
معلومات صاحب البلاغ
ايدي المنصوب عليه : ${reported.id}
تاق المنصوب عليه : ${reported.tag}

الي اكتب الامر: ${message.author.id}
القضية : ${v.first().content}
الرقم: ${con["nu-users"]}
في انتظر التقديم
`
                                  )

                                  .then(b => {
                                    message.delete();
                                    c.first().delete();
                                    g.first().delete();
                                    f.first().delete();
                                    v.first().delete();
                                    a.delete();
                                    s.delete();
                                    m.delete();
                                    h.delete();
                                    db.insert("users", {
                                      nu: con["nu-users"],
                                      user: reported.id,
                                      usertag: reported.tag,
                                      message: al,
                                      reported: reporteds.id,
                                      messageid: b.id,
                                      accept: "false",
                                      idby: message.author.id
                                    });
                                  });
                              }
                              if (c.first().content === "server") {
                                var al = `${v.first().content}`;
                                con["nu-servers"] = con["nu-servers"] + 1;
                                fs.writeFile(
                                  `./config.json`,
                                  JSON.stringify(con, null, 5),
                                  function(err) {
                                    if (err) console.log(err);
                                  }
                                );
                                var reported = client.users.cache.get(
                                  f.first().content
                                );
                                if (!reported)
                                  return message.channel.send(
                                    "User not found!"
                                  );
                                channel.send(`معلومات السيرفر النصاب 
ايدي السيرفر : ${g.first().content}
معلومات صاحب البلاغ
ايدي المنصوب عليه : ${message.author.id}
تاق المنصوب عليه : ${message.author.tag}

القضية : ${v.first().content}
الرقم: ${con["nu-servers"]}

`).then(b => {
                                    message.delete();
                                    c.first().delete();
                                    g.first().delete();
                                    f.first().delete();
                                    v.first().delete();
                                    a.delete();
                                    s.delete();
                                    m.delete();
                                    h.delete();
                                    db.insert("servers", {
                                      nu: con["nu-servers"],
                                      user: g.first().content,
                                      message: al,
                                      reported: f.first().content,
                                      messageid: b.id,
                                      accept: "false",
                                      idby: message.author.id
                                    });
                                  });
                              }
                            });
                        });
                      });
                  });
                });
            });
        });
    });
  }
});

//////////////////////////////////////////////////////////////

client.on("message", message => {
  var args1 = message.content.split(" ")[1];
	if (message.author.bot || !message.guild) return;
  if (message.content.startsWith(prefix + "delete-data")) {
if(message.author.id !== "723066108638134303") return;
let done = 0
    db.get("servers", {}).then(rows => {
for(const data of rows){
done = done + 1
db.delete("servers", {"nu": data.nu})
}
    })
    db.get("users", {}).then(rows => {
for(const data of rows){
done = done + 1
db.delete("users", {"nu": data.nu})
}
    })
message.channel.send(`done delete ${done} data.`)
  }
})
