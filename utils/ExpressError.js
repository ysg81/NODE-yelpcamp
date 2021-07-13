// 중복을 줄이기 위해 사용
// error가 날 경우마다 message와 statusCode를 전달해주는 역할 수행
class ExpressError extends Error{
  constructor(message, statusCode){
    super()
    this.message = message;
    this.statusCode = statusCode
  }
}

module.exports = ExpressError;