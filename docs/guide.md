# Setting Guide

## **Install nestjs-cli & Create dir by monoRepo**
- npm i -g @nestjs/cli 로 nest 설치
- nest new project (프로젝트 이름) cli 명령어로 프로젝트 및 폴더 생성
```
app 하위 디렉토리 생성
nest g app game, api etc..

libs 생성 후 하위 디렉토리 생성
nest g lib entity, common, dao etc.. 
```
하위 디렉토리 생성 후 `nest-cli.json`애서 사용안하는 json 삭제 (monoRepo 삭제)


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
Mysql 타임존 변경 (brew install mysql)

만약 DB 시간이랑 코드에 작성한 기준시간이 달라서 에러가 생길때 mysql 타임존 변경을 고려해봐야 된다.
```text
terminal 에 명령어 작성
$ nano /opt/homebrew/etc/my.cnf

default-time-zone = '+00:00' (옵션 추가)

Mysql 서버 재시작  
$ brew services restart mysql  
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

ex) 4G9의 `@Transactional`, `@UserLevelLock`, `@Auth` 등이 있음


Property Decorator
- 객체 속석의 특성을 기술하고 있는 객체

Custom Decorator

ref) https://toss.tech/article/nestjs-custom-decorator

## **Class**

Class 상속이란?
- 상속을 사용하는 이유
    1. 재사용
    2. 유지보수


- **상속의 특징 (부모 클래스와 자식 클래스의 관계)**
    1. 부모 클래스, 자식 클래스는 `extends`에 의해 정해진다.
    2. 하나의 부모 클래스는 여러개의 자식 클래스를 가질 수 있지만 **자식 클래스는 하나의 부모 클래스에게만 상속을 받을 수 있다**.
    3. 부모 클래스로부터 상속받은 자식 클래스는 부모 클래스의 자원 모두를 사용 할 수 있지만 **부모 클래스는 자식 클래스의 자원을 가져다 쓸 수 없다**.
    4. 자식 클래스는 또 다른 부모 클래스가 될 수 있다.
    5. 자식클래스는 부모클래스로부터 물려받은 자원을 override 하여 수정해서 사용 할 수 있다.
    6. 부모의 부모클래스가 상속받은 자원도 자식클래스가 사용 가능


- **Method vs Function**
    - Method : 객체 or 클래스 내에서 선언한 함수
      ```typescript
      class Parent {
          // name == method
          name () {
              // ...      
          }
      }
      ```
    - Function : 객체 or 클래스 내에 속해 있지 않고 독립적으로 로직을 수행 할 수 있는 함수
        - ex) 4G9의 `static.generator.ts`으로 예시 보면 됨
          ```typescript
          // name == function
          function name () {
              // ......
          }
          ```

- **extends vs implement**
    - extends : 클래스에서 상속을 나타내고 확장할 때 사용
  ```typescript
    class Parent {
        private name: string;
        constructor(name: string) {
            this.name
        }
    }
    
    class Child extends Parent {
        //......
        }
    }
    ```
    - implement : 클래스나 객체가 특정 인터페이스를 구현한다는 것을 나타내고, `implement`할때 해당 클래스는 인터페이스에서 정의한 메소드나 속성을 반드시 구현해야됨
        - `4G9의 tranaction.intercepter.ts`보면 `NestInterceptor`를 `implement`하는 예시를 볼 수 있음
   ```typescript
  interface Car {
      start(): void;
      stop(): void;
  }

  class ElectricCar implements Car {
    start() {
    console.log('Starting electric car...');
    }
  
    stop() {
    console.log('Stopping electric car...');
    }
  }
    ```

- **overriding / overloading**
    - overriding : 조상 클래스로 부터 상속받은 메소드 내용을 재정의 하는 것 (**상속관계에서 적용**)
        - 조건
            - 매개변수 숫자가 같아야 됨 (매개변수명은 달라도 됨)
            - 매개변수 타입이 같거나 하위 타입이여야 됨
            - 리턴 타입이 같아야 됨
    - overloading : 하나의 클래스 안에서 같음 이름의 메서드를 여러개 정의하는 것 (**같은 클래스내에서 적용**)
        - 조건
            - 매개변수의 개수 or 타입이 달라야 됨
            - 매개변수를 늘려서 오버로딩하고 싶으면 `?:`(optional property)를 사용

- **접근 한정자**
    - **public** : 어디서나 자유롭게 접근 가능
    - **private** : 내 클래스에서만 접근 가능
      ```typescript
      class Parent {
          private name: string;
          constructor(name: string) {
              this.name
          }
      }
      
      class Child extends Parent {
          getName(): string {
              // name이 private으로 부모클래스에 선언되있어서 이렇게 하면 에러 나옴 
              return `Child Name is ${this.name}`;  
          }
      }
      
      let child = new Child('a') 
      console.log(child.name) // error
      
      child.name = 'b' // error
      ```
    - **protected** : 내 클래스를 상속한 자식 클래스 내에서 까지만 접근 가능
      ```typescript
      class Parent {
       // protected 수식어 사용
       protected name: string;
        constructor(name: string) {
         this.name = name;
         }
       }
  
      class Child extends Parent {
          getName(): string {
              return `Child name is ${this.name}`;
          }
      }
      
      let child = new Child('a');
      console.log(child.getName()); // Child name is a.
      console.log(child.name); // err  
  
      child.name = 'b'; // err
      ```
- **순수 가상함수 (추상 클래스)**
    - 추상 클래스는 객체로 만들지 못하고 **상속으로써만 사용**된다.
    - 추상 클래스를 상속받은 **자식 클래스는 무조건 상속받은 추상 클래스를 override 시켜줘야 된다**.
    - **재정의 해주지 않으면 코드상에서 오류로 판단 한다.**


## **Transaction, UserLevelLock**
transaction: transaction 는 **all or anything** 이며 특징으로는 A(atomicity) C(consistency) I(isolation) D(durability)가 있다.

**transaction ACID 특징**
- A ( Atomicity, 원자성 )
    - transaction 이 database에 모두 반영되던가, 전혀 반영되지 않아야 한다는 것
    - transaction 는 작업 단위별로 이루어 져야함
- C ( consistency, 지속성 )
    - transaction 의 작업 처리 결과가 항상 일관성이 있어야 함
    - 트랜잭션이 진행되는 동안에 데이터베이스가 변경 되더라도 업데이트된 데이터베이스로 트랜잭션이 진행되는것이 아니라, 처음에 트랜잭션을 진행 하기 위해 참조한 데이터베이스로 진행
- I ( isolation, 고립셩 )
    - 둘 이상의 transaction 이 동시에 실행될 경우에 어떤 하나의 트랜잭션이라도 다른 트랜잭션의 연산에 끼어들 수 없다
- D ( durability, 영구성 )
    - transaction 이 완료되었을때 결과는 영구적으로 반영되어야 됨

**transaction 의 commit, rollback**
- commit
    - transaction 의 모든 작업들을 정상 처리하겠다고 확정하는 것 **해당 처리 과정을 DB에 영구 저장하겠다는 의미**
    - commit이 되면 하나의 transaction 이 종료됨
- rollback
    - transaction 중에 **문제가 발생해 처리과정에서 변경사항을 취소하는 것**
    - transaction 은 **시작되기 이전의 상태로 돌아감**


transaction 을 사용하는 예시

2개 이상의 entities 가 동시에 create, update, delete 할때 걸어야 됨! (service 단에)
```typescript
/**
 * 유저 상세 정보 생성
 */
@Transactional(DATABASE_NAME.USER)
async createUserDetail(): Promise<UserDetailDto> {
  const session = ContextProvider.getSession();

  // 생성 확인
  const user = await this.userRepository.findById(session.userId);

  if (user.gameDbId !== 0) {
  throw new ServerErrorException(INTERNAL_ERROR_CODE.USER_ALREADY_CREATED);
}

user.gameDbId = session.gameDbId;

const userDetail = UserDetail.create({
  userId: session.userId,
  loginAt: TimeUtil.now(),
});

await Promise.all([
  // Create user detail
  this.userDetailRepositories[session.database].insert(userDetail),

  // Update user
  this.userRepository.updateById(user.id, user),
]);

return UserDetailDto.fromEntity(userDetail);
}
```
위에 `createUserDetail`과 같이 안에서 `userDetail`, `user`가 동시에 insert, update 되므로 transaction 을 걸어야 됨

이유 : 위에 코드로 예시를 들면 user 또는 userDetail 중 update 나 insert 도중에 잘 실행되지 않았을 경우에 transaction 의 원자성 성격으로
반영되지 않기 위해서 transaction 을 건다.

**UserLevelLock** : C(create) U(update) D(delete) 가 실행될때 걸어야 됨 (controller 단에)
```typescript
@Post('create')
@ApiResponseEntity({ type: UserDetailDto, summary: '유저(상세정보) 생성' })
@UserLevelLock() 
async createUser(): Promise<ResponseEntity<UserDetailDto>> {
  const userDetailDto = await this.userService.createUserDetail();

  return ResponseEntity.ok().body(userDetailDto);
}
```
이유 : 유저들 혹은 유저의 **동시성을 제어**하기 위해서 걸어야됨! 쉽게 예를 들면 빠르게 두번 클릭했을때를 대비한다고 보면됨

## TypeORM
**1. save()**
   ```typescript
   // ex)
   const userRepository = connection.getRepository(User);
   
   const user = await userRepository.findOne(1);
   user.disable()
   
   await userRepository.save(user);
   ```
위에 코드 쿼리를 확인해보면 2번의 SELECT 를 하게 됨

**(쿼리문을 보면 SELECT 2번 UPDATE 1번으로 save 실행됨)**

첫번째 SELECT 은 `findOne()`메서드를 실행한 의도된 쿼리지만, 두번째는 의도된 쿼리가 아니다.

`save()`메서드는 PK가 포함된 엔티티를 저장할때 먼저 `SELECT`를 이용해 id로 조회한 뒤에 레코드가 존재하면 `UPDATE`쿼리를 수행한다.

**2. upsert()**

`upsert()`는 `save()` 를 대체하기 위해 `INSERT`쿼리에서 `ON DUPLICATE KEY UPDATE`를 사용할 수 있게 한다.

`ON DUPLICATE KEY`를 이용해 1062에러가 발생하면 `UPDATE` 수행함

**쿼리 실행 flow**
1. insert 수행
2. 성공 or 실패
3. 실패가 duplicate error(1062 error) 뜨면 업데이트 실행 


  



