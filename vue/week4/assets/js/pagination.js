// 分頁元件
export const pagination = {
    props: ['paginations'],
    template: `<nav class="d-table mx-auto" aria-label="Page navigation">
        <ul class="pagination">
            <li class="page-item" :class="{ disabled: !paginations.has_pre }">
                <a class="page-link" href="#!" @click.prevent="$emit('emitPages', paginations.current_page-1)">上一頁</a>
            </li>
            <li class="page-item" v-for="item in paginations.total_pages" :key="item" :class="{ 'active': item === paginations.current_page }">
                <a class="page-link" href="#!" @click.prevent="$emit('emitPages', item)">{{ item }}</a>
            </li>
            <li class="page-item" :class="{ disabled: !paginations.has_next }">
                <a class="page-link" href="#!" @click.prevent="$emit('emitPages', paginations.current_page+1)">下一頁</a>
            </li>
        </ul>
    </nav>`,
}
