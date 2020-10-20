# CSP-Mock

csp error 확인을 위한 mock server

### /policyType1

- 기본 default: default-src 'self';

### /reportPolicyType

- "Content-Security-Policy" : "default-src 'self'; report-uri /report"

### /reportPolicyType

- "Content-Security-Policy" : "default-src 'self'; report-uri /report"

### /reportOnly

- "Content-Security-Policy-Report-Only" :"default-src 'none'; report-uri /report"

### /frame

- /framePageNoSetting : 설정 x
- /framePage : youtube 설정 ㅇ

### /sslOnly

- https 통신으로만 불러오도록 제한 가능

### /loadImage

- "Content-Security-Policy" : "default-src 'self'; report-uri /report"

---

### (content security policy)

## 뭘까

> 서버에서 제공하는 모든 것 을 맹목적으로 신뢰하는 대신, CSP는 **신뢰할 수 있는 콘텐츠 소스의 허용 목록**을 생성할 수 있게 해주는 Content-Security-Policy **HTTP 헤더**를 정의하고 브라우저에는 이런 소스에서 받은 리소스만 실행하거나 렌더링할 것을 지시 - MDN

= 아무나 인라인 자바스크립트 및 css를 넣지 못하도록 하는 것

## 왜할까

- csp 는 컨텐츠 보안을 강화하기 위해
- **리소스에 대한 접근을 제한**하기 위해서
- Cross-site scripting

  html 에 스크립트나 리소스가 삽입되면 이후부터는 그 리소스를 검증하지 않기 때문!

  ```tsx
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <script src="http://nextlocal.dobbisnotfree.com/static/temp.js"></script>
      <title>Title</title>
    </head>
    <body>
      // ...
    </body>
    <script>
      const testClick = () => {
        console.log("click");
      };
    </script>
  </html>
  ```

  다른 사이트로 탈취한 정보를 전송하는 행위가 이루어지기 때문인데, 여기에 다운받을 수 있는 타입을 지정하므로서 보안을 강화

  - 만약 [http://nextlocal.dobbisnotfree.com/static/temp.js](http://nextlocal.dobbisnotfree.com/static/temp.js) 스크립트에서 정보를 탈취한다면 바로 털리겠쥬?

## 어떻게 설정?

HTTP 헤더!

```tsx
Content-Security-Policy: <policy-directive>; <policy-directive>
```

- 여러 directives(정책명시) 를 나열 가능

### policy-directive

> fetch-directives 'keword' domain

fetch-directives

- default-src : 다른 설정이 없을 때 가장 기본이 되는 설정 (만약 다른 설정들이 있다면 그것으로 대체됨)
  - default-src 에 포함된 상세
- form-action 은 <form> 태그에서의 제출을 위해 유효한 엔드포인트를 나열합니다.
- base-uri 는 페이지의 <base> 요소에 나타날 수 있는 URL을 제한합니다 `document.baseURI`
- img-src
- font-src : font
- **sandbox** : 페이지가 취할 수 있는 작업에 제한
  - 페이지가 sandbox 속성을 가진 <iframe> 내부에서 로드된 것처럼 취급됩니다.
  - iframe sandbox 설정처럼 추가 설정을 잡을 수 있는 것. ex) 외부와의 통신이 가능하게 할 것인지, 팝업이 가능한지 ..
  - sandbox 설정

keword (작은 따옴표 꼭 필요)

- `none` : 아무것도 허용하지 않음
- `self` : 현재 출처 허용, sub 도메인 허용x.
- `unsafe-inline` : 인라인 자바스크립트 및 CSS를 허용
- `unsafe-eval` : eval 허용 (하지마라)

domain

- 허용하고자 하는 특정 도메인
- 없으면 전체 도메인에 대해 처리됨

### inline script - nonce

- inline script 를 막은 것이 보안 상 좋음

  ⇒ inline script 로 탈취가 가능하기 때문

- 하지만 꼭 필요하다면 nonce를 사용할 수 있음 (헤더에 nounce 값 설정 필요)

```tsx
<script nonce=EDNnf03nceIOfn39fn3e9h3sdfa>
  //Some inline code I cant remove yet, but need to asap.
</script>

```

`Content-Security-Policy: script-src 'nonce-EDNnf03nceIOfn39fn3e9h3sdfa'`

- 모든 페이지 요청에 대해 난스를 추측할 수 없도록 다시 생성
- hash 도 가능

### Report bad access

```tsx
Content-Security-Policy: default-src 'self'; report-uri /report;
```

- 정책과 다른 경우에는 report 할 수 있는 url 을 추가 할 수도 있습니다
- [http://nextlocal.dobbisnotfree.com:3000/reportPolicyType](http://nextlocal.dobbisnotfree.com:3000/reportPolicyType)

### SSL only 도 가능

```tsx
default-src https:; script-src-elem https:;
```

- [http://nextlocal.dobbisnotfree.com:3000/sslOnly](http://nextlocal.dobbisnotfree.com:3000/sslOnly)

### Header 라고 했는데 Meta 테그로 하는건 또 뭐죠?

- html 에서 페이지에 대한 정책을 직접 설정도 가능

## 잠깐! 도입 하기 전

- 모니터링이 필요
- 그냥 넣으면 무조건 에러 난다

```tsx
Content-Security-Policy-Report-Only: default-src 'self'; ...; report-uri /my_amazing_csp_report_parser
```

- 에러는 내지 않고 모니터링만 하는 옵션도 있음

## Ref

- [https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy#Fetch_directives](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy#Fetch_directives)
- [https://developer.mozilla.org/ko/docs/Web/HTTP/Headers/Content-Security-Policy/default-src](https://developer.mozilla.org/ko/docs/Web/HTTP/Headers/Content-Security-Policy/default-src)
- [https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/sandbox](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/sandbox)
-
