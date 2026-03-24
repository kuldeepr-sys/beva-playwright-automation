'use strict';

const BASE_URL = process.env.BASE_URL || 'https://beva.inheritxdev.in';

const ROUTES = {
  HOME:            '/',
  LOGIN:           '/login',
  SIGNUP:          '/signup',
  FORGOT_PASSWORD: '/forgot-password',
  DASHBOARD:       '/user/dashboard',
  DISCOVER:        '/user/discover',
  MY_COMPETITIONS: '/user/my-competitions',
  LEADERBOARD:     '/user/leaderboard',
  VENUES:          '/user/venues',
  CONTACT_INFO:    '/user/contact-info',
  ABOUT_US:        '/user/contact-info/AboutUs',
  TERMS:           '/user/contact-info/Terms&Conditions',
  FAQ:             '/user/contact-info/FAQ',
  PRIVACY:         '/user/contact-info/PrivacyPolicy',
};

const USERS = {
  PLAYER: {
    email:    process.env.PLAYER_EMAIL    || 'player1@beva.com',
    password: process.env.PLAYER_PASSWORD || 'Test@123456',
  },
};

const TIMEOUTS = {
  SHORT:  5_000,
  MEDIUM: 10_000,
  LONG:   30_000,
};

module.exports = { BASE_URL, ROUTES, USERS, TIMEOUTS };
