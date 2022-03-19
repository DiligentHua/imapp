
import Vue from 'vue'
const userInfo = 'userInfo'

export function getInfo() {
  return Vue.$cookies.get(userInfo)
  // return localStorage.getItem(userInfo)
}

export function setInfo(user) {
  return Vue.$cookies.set(userInfo, user)
  // return localStorage.setItem(userInfo, username)
}

export function removeInfo() {
  return Vue.$cookies.remove(userInfo)
  // return localStorage.removeItem(userInfo)
}