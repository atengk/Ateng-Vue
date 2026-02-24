// composables/useOrgChart.ts
import { ref, shallowRef, onUnmounted, type Ref } from 'vue';
import { OrgChart } from 'd3-org-chart';

// 定义基础节点接口
export interface OrgNode {
    id: string;
    parentId?: string;
    name: string;
    title?: string;
    image?: string;
    [key: string]: any; // 允许扩展自定义属性
}

interface UseOrgChartOptions<T> {
    data: Ref<T[]>;
    containerId?: string;
    nodeWidth?: number;
    nodeHeight?: number;
    onNodeClick?: (nodeId: string) => void;
}

export function useOrgChart<T extends OrgNode>(options: UseOrgChartOptions<T>) {
    const chartRef = ref<HTMLElement | null>(null);
    const chartInstance = shallowRef<OrgChart<T> | null>(null);

    // 初始化图表
    const initChart = () => {
        if (!chartRef.value) return;

        chartInstance.value = new OrgChart<T>()
            .container(chartRef.value as any)
            .data(options.data.value)
            .nodeWidth(() => options.nodeWidth || 250)
            .nodeHeight(() => options.nodeHeight || 120)
            .childrenMargin(() => 50)
            .compact(false)
            // 核心：点击事件钩子
            .onNodeClick((d) => {
                if (options.onNodeClick) options.onNodeClick(d.data.id);
            })
            // 核心：自定义节点内容（支持头像和自定义HTML）
            .nodeContent((d) => {
                const color = '#ffffff';
                return `
          <div style="font-family: 'Inter', sans-serif; background-color:${color}; position:relative; width:${d.width}px; height:${d.height}px; border-radius:10px; border: 1px solid #E4E2E9">
            <div style="position:absolute; margin-top:-25px; margin-left:${d.width / 2 - 25}px; width:50px; height:50px; border-radius:50px; border:3px solid #3AB6E3; overflow:hidden; background:#fff">
               <img src="${d.data.image || 'https://via.placeholder.com/50'}" style="width:100%;height:100%;object-fit:cover" />
            </div>
            
            <div style="padding-top:35px; text-align:center">
              <div style="color:#08011E; font-size:16px; font-weight:bold">${d.data.name}</div>
              <div style="color:#716E7B; font-size:13px; margin-top:4px">${d.data.title || ''}</div>
            </div>

            <div style="display:flex; justify-content:space-between; padding:10px; margin-top:5px; border-top:1px solid #F0F0F0">
               <div style="font-size:10px; color:#999">ID: ${d.data.id}</div>
               <div style="font-size:10px; color:#3AB6E3">部门：${d.data.department || 'N/A'}</div>
            </div>
          </div>
        `;
            });

        chartInstance.value.render();
    };

    // 展开/收起所有节点
    const expandAll = () => {
        chartInstance.value?.expandAll().render();
    };

    const collapseAll = () => {
        chartInstance.value?.collapseAll().render();
    };

    // 居中某个节点
    const fitNode = (nodeId: string) => {
        chartInstance.value?.setCentered(nodeId).render();
    };

    // 导出图片
    const exportImg = () => {
        chartInstance.value?.exportImg();
    };

    onUnmounted(() => {
        if (chartInstance.value) {
            chartInstance.value = null;
        }
    });

    return {
        chartRef,
        chartInstance,
        initChart,
        expandAll,
        collapseAll,
        fitNode,
        exportImg
    };
}