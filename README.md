# 보드게임 룰북 설명 챗봇 만들기

이 프로젝트는 [Chatbot UI Lite](https://github.com/mckaywrigley/chatbot-ui-lite)를 기반으로 하며, ChatGPT Assistants를 사용하여 보드게임 룰북을 설명하는 챗봇을 생성하는 방법을 설명합니다.

## 1. ChatGPT Assistants 생성하기

1. [OpenAI Assistants 페이지](https://platform.openai.com/assistants)에 접속합니다.
2. 우측 상단의 **Create** 버튼을 클릭합니다.
3. 다음과 같이 입력합니다.

    - **Name**: 룰북설명서
    - **Instructions**:
      ```
      목적:
      사용자가 보드게임의 룰북을 이해하고, 게임을 정확하게 즐길 수 있도록 돕는 것을 목표로 합니다. 이 API는 보드게임의 규칙, 턴 진행 방법, 점수 계산 방식을 체계적이고 이해하기 쉽게 설명합니다. (이모티콘을 적극 사용합니다.)
      
      기능:
      1. 게임 소개
         - 게임의 배경, 테마 및 목표를 설명합니다.
         - 게임 구성 요소(카드, 말, 주사위, 게임판 등)를 설명합니다.
         - 참가 가능 인원, 플레이 시간, 난이도 등의 필수 정보를 제공합니다.
      2. 설정 및 준비
         - 게임 시작 전 준비 작업을 단계별로 안내합니다.
         - 초기 세팅에 필요한 모든 것을 설명하고 주의사항을 안내합니다.
      3. 게임 진행
         - 각 턴에 플레이어가 수행할 수 있는 행동을 명확히 설명합니다.
         - 주요 메커니즘을 설명하여 전략적 이해를 돕습니다.
      4. 특수 규칙 및 예외사항
         - 특수 상황과 예외 규칙을 설명합니다.
      5. 점수 계산 및 승리 조건
         - 종료 조건, 승리 조건, 점수 계산 방법을 설명합니다.
      6. 예시 및 시나리오
         - 예시 턴 진행 및 시나리오를 통해 게임의 흐름을 쉽게 이해하도록 돕습니다.
      7. FAQ 및 오류 정정
         - 자주 묻는 질문과 게임 중 발생할 수 있는 오류를 정정합니다.
      
      응답 형식:
      - 간결하고 명확한 문장을 사용합니다.
      - 목록, 단계별 가이드, 도표 등을 활용하여 설명합니다.
      - 중요한 부분은 강조합니다.
      ```

4. **Model**: 원하는 모델 선택
5. **Tools**: **File Search** 옵션을 활성화한 후 룰북 파일을 첨부합니다.

## 2. 웹페이지 만들기

1. [Chatgpt Assistant UI Lite](https://github.com/rivolt2022/chatgpt-assistant-ui-lite) 레포지토리를 클론합니다.

    ```bash
    git clone https://github.com/rivolt2022/chatgpt-assistant
    ```

2. 클론한 레포지토리의 루트 디렉토리의`.env` 파일에 다음과 같이 작성합니다.

    ```bash
    NEXT_PUBLIC_OPENAI_API_KEY=<YOUR_KEY>
    NEXT_PUBLIC_OPENAI_ASSISTANT_ID=<YOUR_ASSISTANT_ID>
    ```

    - 여기서 `NEXT_PUBLIC_OPENAI_ASSISTANT_ID`는 앞서 생성한 Assistant의 ID입니다.

3. 의존성을 설치합니다.

    ```bash
    npm i
    ```

4. 애플리케이션을 실행합니다.

    ```bash
    npm run build
    npm run start
    ```

## 3. 로컬에서 실행하기

1. 레포지토리를 클론합니다.

    ```bash
    git clone https://github.com/rivolt2022/chatgpt-assistant-ui-lite
    ```

2. 의존성을 설치합니다.

    ```bash
    npm i
    ```

3. `.env.local` 파일을 생성하고 OpenAI API 키를 입력합니다.

    ```bash
    NEXT_PUBLIC_OPENAI_API_KEY=<YOUR_KEY>
    NEXT_PUBLIC_OPENAI_ASSISTANT_ID=<YOUR_KEY>
    ```

4. 애플리케이션을 실행합니다.

    ```bash
    npm run dev
    ```

5. 이제 챗봇과 대화를 시작할 수 있습니다. 챗봇을 원하는 형태로 수정하고 기능을 확장해보세요!
