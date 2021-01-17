import { secure } from '@/modules/axios';
import qs from 'qs';

const baseURL = '/api/v2/manga_entries';

export const index = (page, status, tagIDs, searchTerm, sort) => secure
  .get(baseURL, {
    params: {
      page, status, user_tag_ids: tagIDs, search_term: searchTerm, sort,
    },
    paramsSerializer: (params) => qs.stringify(params, {
      arrayFormat: 'brackets',
    }),
    timeout: 3000,
  })
  .then((response) => response)
  .catch((request) => {
    if (request.message.includes('timeout')) {
      return {
        status: 408,
        data: {
          error: 'Something went wrong, try again later or contact hi@kenmei.co',
        },
      };
    }

    return request.response;
  });
export const pagyInfo = (page, status, tagIDs, searchTerm, sort) => secure
  .get(`${baseURL}/pagy_info`, {
    params: {
      page, status, user_tag_ids: tagIDs, search_term: searchTerm, sort,
    },
    paramsSerializer: (params) => qs.stringify(params, {
      arrayFormat: 'brackets',
    }),
  })
  .then((response) => response)
  .catch((request) => request.response);
