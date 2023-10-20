import { useParamStore } from '../store';

const paramStore = useParamStore();
const CONTACT = '@';

// 排序
export const SORT_ORDER = {
  asc: 'asc',
  desc: 'desc',
};
// 记录状态
const RECORD_STATUS = 'record-status';
export const RECORD_STATUS_ARRAY = paramStore.dictsMap.get(RECORD_STATUS);
export const getRecordStatusName = function (value) {
  return paramStore.dictTypeNameMapping.get(`${RECORD_STATUS}${CONTACT}${value}`);
};
export const RECORD_STATUS_VALID = 1;

// 用户状态
const SYS_USER_STATUS = 'sys-user-status';
export const SYS_USER_STATUS_ARRAY = paramStore.dictsMap.get(SYS_USER_STATUS);
export const getSysUserStatusName = function (value) {
  return paramStore.dictTypeNameMapping.get(`${SYS_USER_STATUS}${CONTACT}${value}`);
};
