<template>
        <!-- style="border: 1px solid #000; padding: 0.5em;" -->
        <div v-if="data.length">
                <ul>
                        <li v-for="(item, index) of data" :key="index">
                                <a href="javascript:void(0);" @click="scrollTo(item.uuid)">{{ item.label }}</a>
                                <Item :data="item.children" />
                        </li>
                </ul>
        </div>
</template>

<script>
export default {
        name: 'Item',
        props: {
                data: { type: Array, required: true },
        },
        data() {
                return {};
        },
        components: {},
        mounted() {},
        methods: {
                async scrollTo(id) {
                        const { name } = await logseq.Editor.getCurrentPage();
                        console.log('Page name', name);

                        console.log('Scrolling (hardcoded)');
                        logseq.Editor.scrollToBlockInPage(
                                name, // name of page
                                id // into block uuid
                        );
                },
        },
        computed: {
                treeList() {
                        const items = this.data.map((item) => Object.assign({}, item, { children: [] })); // Deep clone the list and add a children property with empty array value to each item

                        const byValue = new Map(items.map((item) => [item.value, item])); // Organize items into a map keyed by item value for easy lookup

                        const topLevel = []; // Top level will contain the items which do not have a parent
                        for (const item of items) {
                                const parent = byValue.get(item.parent); // Look up the parent item if there is one

                                if (parent) parent.children.push(item);
                                // Append item into the parent's children array
                                else topLevel.push(item); // Item has no parent
                        }

                        return topLevel;
                },
        },
};
</script>