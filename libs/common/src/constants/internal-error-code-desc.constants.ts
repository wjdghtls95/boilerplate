import { INTERNAL_ERROR_CODE as e } from './internal-error-code.constants';

export const INTERNAL_ERROR_CODE_DESC = {
  // SESSION
  [e.SESSION_NOT_FOUND]: '유효하지 않은 세션 정보',
  [e.SESSION_RE_LOGIN]: '다른 기기에서 재 로그인',
  [e.SESSION_NOT_EXIST_USER_ID_IN_HEADER]:
    '세션 정보가 헤더에 포함 되어 있지 않음',

  // USER
  [e.USER_NOT_FOUND]: '유저 정보를 찾을 수 없음',
  [e.USER_ALREADY_CREATED]: '이미 생성 된 유저',

  // USER DETAIL
  [e.USER_DETAIL_NOT_FOUND]: '유저 상세 정보를 찾을 수 없음',

  // ADMIN
  [e.ADMIN_USER_CONFLICT_EMAIL]: '어드민 유저 이메일 중복',

  // DATABASE
  [e.DB_USER_LEVEL_LOCK_NOT_RELEASE]: 'db user level lock 미 해제',
  [e.DB_UPDATE_FAILED]: 'db 얻데이트 실패',
} as const;
