import { useParamStore } from '../store';

const paramStore = useParamStore();
const CONTACT = '@';

const RECORD_STATUS = 'record-status';
export const RECORD_STATUS_ARRAY = paramStore.dictsMap.get(RECORD_STATUS);
export const getRecordStatusName = function (value) {
  return paramStore.dictTypeNameMapping.get(`${RECORD_STATUS}${CONTACT}${value}`);
};
export const RECORD_STATUS_INVALID = 2;
