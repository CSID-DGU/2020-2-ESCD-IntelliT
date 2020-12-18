import Page from '../../common/page';

Page({
  onClickButton() {    
    wx.requestSubscribeMessage({
      tmplIds: ["iaLbIzKnYfX8g8Ek03J3Er8ZOZeUy_4W5e3zr-2RsNM"],
      success(templateRes){
        wx.login({
        success (loginRes) {          
          let code = loginRes.code
          let appid = "wx5be09fc9ea2bb7af"
          let secret = "73c38d218a25bd2399786e99dc55486a"
          if (code) {                                
            wx.request({
              url: 'https://team-a.miniform.kr:80',
              method: 'GET',
              data: {
                code: code,
                appid: appid,
                secret: secret
              },             
              success (openidRes) {
                wx.request({
                  url: "https://open.ifprod.cc/api/v1/shoots/pay",
                  method: 'POST',
                  data: {
                    openId: openidRes.data.openid,
                    amount: 10
                  },
                  success (payRes) {
                    wx.requestPayment({
                      timeStamp: payRes.data.timeStamp,
                      nonceStr: payRes.data.nonceStr,
                      package: payRes.data.package,
                      signType: payRes.data.signType,
                      paySign: payRes.data.paySign,
                      success (payRes) { },
                      fail (payRes) { }
                    })
                  }
                })
              }
            })        
          } else {
            console.log('Login failed' + loginRes.errMsg)
          }
        }
      })
      },
      fail (templateRes) {
        console.log(templateRes) 
      }
    }) 
  },
  data: {
    imageURL: 'https://www.pikpng.com/pngl/m/48-480317_free-coffee-cup-png-images-coffee-cup-top.png',
    imageURL2: 'https://assets.stickpng.com/thumbs/580b57fcd9996e24bc43c550.png'
  }
});
