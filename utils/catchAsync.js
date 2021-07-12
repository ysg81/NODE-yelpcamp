// async의 try catch 미들웨어
// app.method에서 직접 try catch로 구현 가능, 중복을 줄이기 위해 사용

// ********************************************
module.exports = func => {
  return(req, res, next) => {
    func(req, res, next).catch(next);
  }
}
// ********************************************