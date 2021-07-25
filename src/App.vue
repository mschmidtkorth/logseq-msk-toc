<template>
        <div id="toc">
                <!-- NOTE: For indentation to work, make sure your headings are indented - if a h2 follows a h1 it will not be considered a child, only if it is indented. -->
                <!-- TODO: Implement command without any "trace" left in text - e.g. remove line/ "/toc" after return (note that it could have been added at thhe end of an existing line so cannot simply delete whole line) -->
                <input id="search" type="text" v-model="searchTerm" placeholder="Search" />

                <Item :data="treeList" />
        </div>
</template>

<script>
import Item from './components/Item';
import { ref } from 'vue';
// Note: Any variables set here are only re-initialized when disabling/enabling plugin, not when simply using the plugin again. To clear between runs, clear in any method
let headings = ref([]);
let headingsCopy = null;
let searchTerm = '';

let currentLevel = 0;
let previousLevel = 0;

export default {
        name: 'App',
        data() {
                return {
                        headings,
                        searchTerm,
                        currentLevel,
                        previousLevel,
                };
        },
        components: { Item },
        mounted() {
                logseq.Editor.registerSlashCommand('ToC - Table of Contents', async () => {
                        // Store headings
                        const pageBlocksTree = await logseq.Editor.getCurrentPageBlocksTree();

                        // Clear global variable as otherwise content is kept between runs (i.e. static)
                        headings.value = [];
                        this.searchTerm = '';
                        // Update array
                        this.getHeadings(pageBlocksTree);

                        logseq.showMainUI();
                });
        },
        methods: {
                // Checks if block is a heading
                isHeading(block) {
                        return block.type == 'heading' || block.properties?.heading;
                },
                // Returns headings part of block or children
                getHeadings(block) {
                        // console.log('# Starting for ', block);
                        // Find headings directly part of block
                        let block2 = Array.isArray(block) ? block : [block];
                        // console.log('# Iterating over ', block2);
                        for (let subBlock of block2) {
                                // Identify heading (first level)
                                if (this.isHeading(subBlock)) {
                                        // console.log('# Found heading', subBlock, 'level=', subBlock.level, 'anchor=', subBlock.anchor, 'content=', subBlock.content, subBlock.uuid);

                                        if (!(subBlock.anchor in this.headings)) this.headings.push({ value: subBlock.anchor, label: this.getLabelNode(subBlock), id: subBlock.id, uuid: subBlock.uuid, parent: subBlock.parent.id });
                                }

                                if (subBlock.children?.length > 0) {
                                        // console.log('# Continuing for child');
                                        for (let child of subBlock.children) this.getHeadings(child);
                                }
                        }

                        // console.log('# Result', this.headings);

                        return this.headings;
                },
                getLabelNode(block) {
                        if (block.hasOwnProperty('title') && block.title[0]) {
                                if (typeof block.title[0][1] == 'string') {
                                        return block.title[0][1];
                                } else {
                                        // e.g. a Heading that is a link
                                        if (block.title[0][1].hasOwnProperty('url')) {
                                                // Links have the format of: {url: Array(2), label: Array(1), fullText: "[Project Members](https://salesforce.quip.com/hyszAzKXv60g)", metadata: ""}
                                                return block.title[0][1].fullText.match(/\[(.*?)\]/)[1]; // Get link title
                                        } else {
                                                // Some other type
                                                return block.title[0][1].fullText;
                                        }
                                }
                        } else {
                                return '';
                        }
                },
        },
        watch: {
                searchTerm: function (newVal, oldVal) {
                        if (!this.headingsCopy) this.headingsCopy = this.headings;
                        // console.log('# Searching for', newVal);
                        let newHeadings = [];
                        for (let heading of this.headingsCopy) {
                                // console.log('# Found match', heading);
                                if (heading.label.toLowerCase().includes(newVal.toLowerCase())) newHeadings.push(heading);
                        }
                        // console.log('# Search results', newHeadings)
                        this.headings = newHeadings;
                },
        },
        computed: {
                // From: https://stackoverflow.com/questions/47903108/show-objects-array-as-a-nested-list
                treeList() {
                        // Deep clone the list and add a children property with empty array value to each item
                        const items = this.headings.map((item) => Object.assign({}, item, { children: [] }));

                        // Organize items into a map keyed by item value (id) for easy lookup
                        const byValue = new Map(items.map((item) => [item.id, item]));

                        // Top level will contain the items which do not have a parent
                        const topLevel = [];
                        for (const item of items) {
                                // Look up the parent item if there is one
                                const parent = byValue.get(item.parent);

                                if (parent) {
                                        // Append the item into the parent's children array
                                        parent.children.push(item);
                                } else {
                                        // The item has no parent
                                        topLevel.push(item);
                                }
                        }

                        return topLevel;
                },
        },
};
</script>