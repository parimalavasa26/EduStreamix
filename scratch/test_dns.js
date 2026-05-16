const dns = require('dns');

const target = '_mongodb._tcp.project1.ixuccs7.mongodb.net';

dns.resolveSrv(target, (err, addresses) => {
  if (err) {
    console.error('DNS Resolution Failed:', err);
    return;
  }
  console.log('DNS Resolution Successful:', addresses);
});
