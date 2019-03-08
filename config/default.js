module.exports = {
    frontend: {
        api_version: 'v1',
        api_client_id: 'G9eCdmCt4XgC63ZvobovNXiLtDQmzc',
        domain_name: 'bizaway.com',
        access_point: 'app',
        access_cookie_sa_name: 'access_sa_token',
        access_cookie_name: 'access_tokens',
        access_cookie_lifetime: 365, // in days
        force_account: false,
        account_test: 'acme',
        intercom: {
            is_active: true,
            app_id: 'dqwhx6qi'
        },
        deprecated_cookies: [
            'last-hotel-booking-1',
            'last-hotel-booking',
            'last-train-booking',
            'last-car-booking',
            'last-flight-booking',
            'search-hotels-history',
            'search-hotels-params',
            'search-trains-history',
            'search-trains-params',
            'search-flights-history',
            'search-flights-params',
            'search-car-history',
            'bz_cars_cookie_history'
        ],
        cookie_versions: {
            bz_hotels_search_history: '1.0',
            bz_hotels_search_params: '1.0',
            bz_hotels_last_booking: '1.1',
            bz_flights_search_history: '1.2',
            bz_flights_search_params: '1.2',
            bz_flights_last_booking: '1.3',
            bz_cars_search_history: '1.0',
            bz_cars_search_params: '1.0',
            bz_cars_last_booking: '1.1',
            bz_trains_search_history:'1.2',
            bz_trains_search_params: '1.2',
            bz_trains_last_booking: '1.2'
        },
        map_style: [{featureType:'administrative.land_parcel',elementType:'all',stylers:[{visibility:'off'}]},{featureType:'landscape.man_made',elementType:'all',stylers:[{visibility:'off'}]},{featureType:'poi',elementType:'labels',stylers:[{visibility:'off'}]},{featureType:'road',elementType:'labels',stylers:[{visibility:'simplified'},{lightness:20}]},{featureType:'road.highway',elementType:'geometry',stylers:[{hue:'#f49935'}]},{featureType:'road.highway',elementType:'labels',stylers:[{visibility:'simplified'}]},{featureType:'road.arterial',elementType:'geometry',stylers:[{hue:'#fad959'}]},{featureType:'road.arterial',elementType:'labels',stylers:[{visibility:'off'}]},{featureType:'road.local',elementType:'geometry',stylers:[{visibility:'simplified'}]},{featureType:'road.local',elementType:'labels',stylers:[{visibility:'simplified'}]},{featureType:'transit',elementType:'all',stylers:[{visibility:'off'}]},{featureType:'water',elementType:'all',stylers:[{hue:'#a1cdfc'},{saturation:30},{lightness:49}]}]
    },
    backend: {
        host: '*',
        port: 9000
    },
    paths: {
        app: './app',
        dist: './dist',
        tmp: './.tmp'
    }
};
