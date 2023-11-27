# Setting Guide 

## **Install nestjs-cli**
- npm i -g @nestjs/cli 로 nest 설치
- nest new project (프로젝트 이름) cli 명령어로 프로젝트 및 폴더 생성
```
app 하위 디렉토리 생성
nest g app game, api etc..

libs 생성 후 하위 디렉토리 생성
nest g lib entity, common, dao etc.. 
```
하위 디렉토리 생성 후 `nest-cli.json`애서 사용안하는 json 삭제


## **Install db with homebrew** 
install mysql on mac(homebrew)

`$ brew install mysql`

How to connect (ref: `https://chobopark.tistory.com/237`)

`$ mysql -u[user] -p`
or
`$ mysql -u[user] -h[HOST] -P[PORT] -p`
enter password: 

- root 계정으로 들어가서 밑에 순서대로 user create 하고 권한까지 줘야됨
```
1. mysql -uroot -p

2. use '데이터베이스 이름';

3. create user
    - 내부 ip접속: create user '계정아이디'@localhost identified by '계정 비밀번호';
    - 외부 ip접속: create user '계정아이디'@'%' identified by '계정 비밀번호';
    
4. select host,user from user; (생성된 유저 아이디 확인)

5. grant all privileges on '데이터베이스이름'.'테이블이름' to '계정아이디'@'호스트' identified by '계정비밀번호' with grant option;

6. flush privileges; (권한 부여한 아이디 권한 적용)

7. show grants for '계정아이디'@'호스트'; (권한 부여 적용 확인) 
```
**ref)**
    1. https://chobopark.tistory.com/237
    2. https://dev-coco.tistory.com/53 (권한 관리)

install redis on mac(homebrew)

`$ brew install redis`

How to connect

`$ redis-cli (local)` 
or
`$ redis-cli -h [HOST] -p [PORT]`

## Setting DB with docker
1. `docker-compose.yml` 생성

- **mysql**
```dockerfile
   version: "3"
   services:
        project_name:
           container_name: project_name
           platform: linux/x86_64  -> m1 일때 적용
           image: mysql:8.0.23
           command:
            - --default-authentication-plugin=mysql_native_password
            - --character-set-server=utf8mb4
            - --collation-server=utf8mb4_unicode_ci
            - --lower_case_table_names=1
              restart: always
              environment:
              MYSQL_ROOT_PASSWORD: ROOT_PASSWORD
              MYSQL_DATABASE: DATABASE_HOST
              MYSQL_USER: DATABASE_USER_NAME
              MYSQL_PASSWORD: DATABASE_PASSWORD
              ports:
            - "3306:3306" -> 앞에는 원하는 포트 번호
```
- **redis**
```dockerfile
version: "3"
services:
    project_name:
        container_name: project_name
        image: redis:alpine
        restart: always
        volumes:
          - ./redis-data:/var/lib/redis
        environment:
          - REDIS_REPLICATION_MODE=master
        ports:
          - "6379:6379" -> 앞에는 원하는 포트 번호
```
2. `docker-compose up -d` 로 yml 파일 실행 

만약 docker 내리고 싶으면 `docker-compose down`으로 도커 다운

## Login Flow 

Authentication(인증)

- 사용자인지 확인하는 과정 
  
  - ex) 로그인 과정
 
Authorization(인가)

- 사용자의 권한을 확인하는 과정
    
  - ex) 네이버 블로그 열람할 수 있는 권한 

Authentication Strategies
1. Basic Authentication **(4G9에서 사용하는 전략)** 

   - HTTP를 통해 리소스에 접근하기 위한 인증 방법으로 credentials가 요청 헤더로 전달되는 방식
   - API에서도 사용 가능하지만 TLS/HTTPS와 사용하지 않으면 credentials를 디코딩할 수 있어서 안전하진 않음

2. Session Based Authentication

   - 유저가 유니크한 identifier에 배정되고 identifier는 서버 메모리에 저장되며 identifier를 `session`이라 불림
   - stateful한 인증 방법

3. Token Bases Authentication

   - 요청마다 credentials(username, password)를 보내는 Basic Auth 방식과 다르게, 매 요청에서 토큰(token)을 보내는 방식
     - **Token?**
       - 서버에서 생성한 문자열, 클라이언트가 요청에 사용 가능
       - 서버가 저장하지 않음 (stateless)
       - 시간이 지나면 만료될 수 있음
       - 암호로 서명되어 서버에서 신뢰할 수 있음
       - 의미없는 랜덤 문자열, 인증 서버에 의해서만 확인 가능
       - **self-contained**: 토큰이 데이터를 가지고 있고, 클라이언트가 볼 수 있음 (e.g. JWT Tokens)

**ref)** https://velog.io/@jiseung/Authentication-Strategies

## Decorator
- 데코레이터는 하나 이상 연결해 사용 가능
- 실행흐름 

ex)
```typescript
// Size 데코레이터 팩토리
function Size() {
  console.log('Size(): 평가됨');
  // Size 데코레이터
  return function(target:any, prop:string, desc:PropertyDescriptor){
    console.log('Size(): 실행됨')
  }
}

// Color 데코레이터 팩토리
function Color() {
  console.log('Color(): 평가됨');
  // Color 데코레이터
  return function(target:any, prop:string, desc:PropertyDescriptor){
    console.log('Color(): 실행됨')
  }
}

// Button 클래스 정의
class Button {
  // 메서드에 멀티 데코레이터 적용
  @Size()
  @Color()
  isPressed() {}
}

// result
Size(): 평가됨
Color(): 평가됨
Color(): 실행됨
Size(): 실행 
```

Class Decorator
- 클래스에 설정하는 데코레이터, 클래스 생성자에 적용되 클래스 정의를 읽거나 수정 가능
- 선언 파일과 선언 클래스내에서 사용 x

ex) 4G9의 `@EntityRepository`가 대표적

Method Decorator
- 메서드 바로 앞에 선언 가능
- 선언 파일, 오버로드 메서드, 선언 클래스에서 사용불가

ex) 4G9의 `@Transactional`, `@UserLevelLock`, `Auth` 등이 있음


Property Decorator
- 객체 속석의 특성을 기술하고 있는 객체

Custom Decorator 

ref) https://toss.tech/article/nestjs-custom-decorator

## Transcation Flow

