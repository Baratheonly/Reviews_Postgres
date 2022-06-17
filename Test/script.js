import http from 'k6/http';
import { check } from 'k6';

export const options = {
  vus: 100,
  duration: '30s',
}

export default function () {
  let res = http.get('http://localhost:3000/reviews/?product_id=40344');
  check(res, {'is status 200': (r) => r.status === 200});
}