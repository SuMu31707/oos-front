import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import {deleteRequest, getRequest, postRequest, putRequest} from "@/utils/api";
import {downloadRequest} from "@/utils/download";
import {initMenu} from "@/utils/menus";
import 'font-awesome/css/font-awesome.css'

Vue.config.productionTip = false
Vue.use(ElementUI,{size: 'small'})
// 插件形式使用请求
Vue.prototype.postRequest = postRequest;
Vue.prototype.getRequest = getRequest;
Vue.prototype.putRequest = putRequest;
Vue.prototype.deleteRequest = deleteRequest;
Vue.prototype.downloadRequest = downloadRequest;

router.beforeEach((to, from, next) => {
    if (window.sessionStorage.getItem('tokenStr')) {
        initMenu(router, store);
        // 判断用户信息是否存在
        if (!window.sessionStorage.getItem('user')) {
            return getRequest('/admin/info').then(resp => {
                if (resp) {
                    console.log(resp)
                    // 存入用户信息
                    window.sessionStorage.setItem('user', JSON.stringify(resp));
                    store.commit('INIT_ADMIN', resp);
                    next();
                }
            })
        }
        next();
    } else {
        if (to.path == '/') {
            next();
        } else {
            next('/?redirect=' + to.path);
        }
    }
})

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')
