<template>
    <component v-if="!route.hidden" v-bind:is="resolveComponent(route.children,route)"/>
</template>

<script>
    import path from 'path'

    export default {
        name: 'sidebar-menu',
        props: {
            route: {
                type: Object,
                required: true
            },
            basePath: {
                type: String,
                default: ''
            }
        },
        created() {
            this.onlyOneChild = null;
        },
        methods: {
            hasOneShowingChild(children = [], parent) {
                const showingChildren = children.filter(item => {
                    if (item.hidden) {
                        return false
                    } else {
                        this.onlyOneChild = item;
                        return true
                    }
                });

                if (showingChildren.length === 1) {
                    return true
                }

                if (showingChildren.length === 0) {
                    this.onlyOneChild = {...parent, path: '', noShowingChildren: true}
                    return true
                }

                return false
            },
            resolvePath(routePath) {
                return path.resolve(this.basePath, routePath)
            },
            resolveComponent(children = [], parent) {
                let showOne = this.hasOneShowingChild(children, parent) && (!this.onlyOneChild.children || this.onlyOneChild.noShowingChildren);
                if (showOne) {
                    return {
                        is: 'sidebar-item',
                        route: this.onlyOneChild,
                        basePath: this.basePath,
                    }
                }
                return {
                    is: 'sidebar-sub-item',
                    route: parent,
                    basePath: this.basePath,
                };

            }
        }
    }
</script>