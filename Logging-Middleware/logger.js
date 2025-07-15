
const axios = require('axios');

const LOG_ENDPOINT = 'http://20.244.56.144/evaluation-service/logs';

const AUTH_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJkdWJleXRhbnlhMjMxMkBnbWFpbC5jb20iLCJleHAiOjE3NTI1NTc2MTcsImlhdCI6MTc1MjU1NjcxNywiaXNzIjoiQWZmb3JkIE1lZGljYWwgVGVjaG5vbG9naWVzIFByaXZhdGUgTGltaXRlZCIsImp0aSI6IjQ3ZjMyNzkyLTM3YzktNGY5Ny04YWVkLTZmYzc3YTNiOTE1NSIsImxvY2FsZSI6ImVuLUlOIiwibmFtZSI6InRhbnlhIGR1YmV5Iiwic3ViIjoiMTA1YmNhZWQtNmI0My00N2RiLTg3ZTQtYWE1NTc3ZGU2NTEyIn0sImVtYWlsIjoiZHViZXl0YW55YTIzMTJAZ21haWwuY29tIiwibmFtZSI6InRhbnlhIGR1YmV5Iiwicm9sbE5vIjoiMjIwMDI3MDEzMDE4MiIsImFjY2Vzc0NvZGUiOiJ1dU1ieVkiLCJjbGllbnRJRCI6IjEwNWJjYWVkLTZiNDMtNDdkYi04N2U0LWFhNTU3N2RlNjUxMiIsImNsaWVudFNlY3JldCI6IkpkWWZReVdVQVRacWh4ZFcifQ.pRdSanj3fbSco8SZ2DyETb5II3KgsQ01Q8NV18PptDs';

const allowedStacks = ['backend', 'frontend'];
const allowedLevels = ['debug', 'info', 'warn', 'error', 'fatal'];
const allowedPackages = [
  'cache', 'controller', 'cron_job', 'db', 'domain', 'handler',
  'repository', 'route', 'service', 'api', 'component', 'hook',
  'page', 'state', 'style', 'auth', 'config', 'middleware', 'utils'
];

async function Log(stack, level, packageName, message) {
  if (
    !allowedStacks.includes(stack) ||
    !allowedLevels.includes(level) ||
    !allowedPackages.includes(packageName)
  ) {
    console.error(' Invalid log parameters');
    return;
  }

  try {
    const response = await axios.post(
      LOG_ENDPOINT,
      {
        stack,
        level,
        package: packageName,
        message
      },
      {
        headers: {
          Authorization: `Bearer ${AUTH_TOKEN}`,
          'Content-Type': 'application/json'
        }
      }
    );

        if (response.status === 200 || response.status === 201) {
    console.log('✅ Log sent successfully:', response.data);
    } else {
    console.error(' Log failed:', response.statusText);
    }

  } catch (error) {
    console.error(' Error sending log:', error.message);
  }
}

module.exports = { Log };
