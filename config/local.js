/*
 * For other configuration check the default.js file.
 */

module.exports = {
    frontend: {
        server: 'local',

        // Your api endpoint
        api_endpoint: "http://192.168.1.13:8080",
        domain_name: 'bizaway.local',
        access_cookie_sa_name: 'access_sa_token_local',
        access_cookie_name: 'access_token_local',
        force_account: true,
        account_test: 'acme',
        intercom: {
            is_active: true,
            app_id: 'e61h5tyr'
        }
    },
    backend: {
        // Host and port of the platform
        host: '192.168.1.13',
        port: 9000
    }
};
