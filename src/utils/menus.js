import {getRequest} from "@/utils/api";
import router from "@/router";

export const initMenu = (router, store) =>{
    if (store.state.routes.length>0){
        return;
    }

    getRequest('/system/cfg/menu').then(data=>{
        if (data){
            // 格式化Router
            let fmtRoutes = formatRoutes(data);
            // 添加到Router
            router.addRoutes(fmtRoutes);
            // 将数据存入Vuex
            store.commit('initRoutes', fmtRoutes);
        }
    })
}

export const formatRoutes = (routes)=>{
    let fmtRoutes = [];
    routes.forEach(router=>{
        let {
            path,
            name,
            component,
            iconCls,
            children
        } = router;
        if (children && children instanceof Array){
            // 递归
            children = formatRoutes(children);
        }
        let fmRouter = {
            path: path,
            name: name,
            iconCls: iconCls,
            children: children,
            component(resolve){
                require(['@/views/' + component+'.vue'],resolve);
            }
        }
        fmtRoutes.push(fmRouter);
    });
    return fmtRoutes;
}