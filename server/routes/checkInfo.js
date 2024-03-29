const express = require("express");
const fs = require("fs");
const router = express.Router();
const mysql = require("mysql");
const bodyparser = require("body-parser");
const multer = require("multer");
const crypto = require("crypto-js");
const bodyparserKorea = require("../config/KoreaEmergency");
const upload = multer();
let notUsing = bodyparserKorea.typing;
router.use(upload.array());
router.use(bodyparser.urlencoded({ extended: false }));
const SecretKey = notUsing;
const connection = require("../config/mysql");

router.post("/check_Info", (req, res) => {
  try {
    let qrInfo = req.body.qrInfo;
    connection.query(
      `select * from User_info where qrlist =?`,
      [qrInfo],
      (err, result) => {
        if (err) {
          console.log(err);
        } else {
          console.log(result);
          if (result.length === 0) {
            res.send(false);
          } else {
            if (result[0].used === "0") {
              res.send(true);
            } else {
              if (result[0].freeInfo === "0") {
                let bloodTypen = crypto.AES.decrypt(
                  result[0].bloodType.toString(),
                  SecretKey
                );
                let bloodType = bloodTypen.toString(crypto.enc.Utf8);

                let agen = crypto.AES.decrypt(
                  result[0].age.toString(),
                  SecretKey
                );
                let age = agen.toString(crypto.enc.Utf8);

                let sexn = crypto.AES.decrypt(
                  result[0].sex.toString(),
                  SecretKey
                );
                let sex = sexn.toString(crypto.enc.Utf8);

                let sergeryn = crypto.AES.decrypt(
                  result[0].sergery.toString(),
                  SecretKey
                );
                let sergery = sergeryn.toString(crypto.enc.Utf8);
                let sergeryUsern = crypto.AES.decrypt(
                  result[0].sergeryFree.toString(),
                  SecretKey
                );
                let sergeryUser = sergeryUsern.toString(crypto.enc.Utf8);

                let illn = crypto.AES.decrypt(
                  result[0].ill.toString(),
                  SecretKey
                );
                let ill = illn.toString(crypto.enc.Utf8);
                let illUsern = crypto.AES.decrypt(
                  result[0].illFree.toString(),
                  SecretKey
                );
                let illUser = illUsern.toString(crypto.enc.Utf8);

                let numbern = crypto.AES.decrypt(
                  result[0].phone.toString(),
                  SecretKey
                );
                let number = numbern.toString(crypto.enc.Utf8);
                let numberUsern = crypto.AES.decrypt(
                  result[0].addPhone.toString(),
                  SecretKey
                );
                let numberUser = numberUsern.toString(crypto.enc.Utf8);

                let medicinen = crypto.AES.decrypt(
                  result[0].medicine.toString(),
                  SecretKey
                );
                let medicine = medicinen.toString(crypto.enc.Utf8);
                let medicineUsern = crypto.AES.decrypt(
                  result[0].medicineFree.toString(),
                  SecretKey
                );
                let medicineUser = medicineUsern.toString(crypto.enc.Utf8);

                let alergyn = crypto.AES.decrypt(
                  result[0].alergy.toString(),
                  SecretKey
                );
                let alergy = alergyn.toString(crypto.enc.Utf8);
                let alergyUsern = crypto.AES.decrypt(
                  result[0].alergyFree.toString(),
                  SecretKey
                );
                let alergyUser = alergyUsern.toString(crypto.enc.Utf8);

                let sideEffn = crypto.AES.decrypt(
                  result[0].sideEff.toString(),
                  SecretKey
                );
                let sideEff = sideEffn.toString(crypto.enc.Utf8);

                let othersn = crypto.AES.decrypt(
                  result[0].others.toString(),
                  SecretKey
                );
                let others = othersn.toString(crypto.enc.Utf8);

                //파일들 복호화 후 json 생성
                const personInfo = {
                  bloodType: bloodType,
                  age: age,
                  sex: sex,
                  sergery: sergery,
                  ill: ill,
                  medicine: medicine,
                  alergy: alergy,
                  sideEff: sideEff,
                  number: number,
                  others: others,
                  free: "none",
                  sergeryUser: sergeryUser,
                  illUser: illUser,
                  numberUser: numberUser,
                  medicineUser: medicineUser,
                  alergyUser: alergyUser,
                };
                const personInfoJSON = JSON.stringify(personInfo);
                const parsedData = JSON.parse(personInfoJSON);
                //json전송
                res.json(parsedData);
              } else if (result[0].freeInfo === "1") {
                let freeTextN = result[0].freeInfoText;
                let freeTextY = crypto.AES.decrypt(
                  freeTextN.toString(),
                  SecretKey
                );
                let freeText = freeTextY.toString(crypto.enc.Utf8);
                let pic1;
                let pic2;
                let pic3;
                let video2;
                if (
                  result[0].freePic != undefined &&
                  result[0].freePic != null &&
                  result[0].freePic != ""
                ) {
                  pic = result[0].freePic.split(",");
                  // pic1 = fs.readFileSync(pic[0], "base64");
                  pic1 = "https://hong4383server.r-e.kr/" + pic[0];
                  if (pic[1] != undefined) {
                    // pic2 = fs.readFileSync(pic[1], "base64");
                    pic2 = "https://hong4383server.r-e.kr/" + pic[1];
                  }
                  if (pic[2] != undefined) {
                    // pic3 = fs.readFileSync(pic[1], "base64");
                    pic3 = "https://hong4383server.r-e.kr/" + pic[2];
                  }
                }
                if (
                  result[0].freeVideo != undefined &&
                  result[0].freeVideo != null &&
                  result[0].freeVideo != ""
                ) {
                  let video = result[0].freeVideo.split(",");
                  video2 = "https://hong4383server.r-e.kr/" + video;
                }
                //json생성
                const personInfo = {
                  freeText: freeText,
                  pic1: pic1,
                  pic2: pic2,
                  pic3: pic3,
                  video: video2,
                  link: result[0].link,
                  free: "yes",
                };
                //json전송
                res.json(personInfo);
              }
            }
          }
        }
      }
    );
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
