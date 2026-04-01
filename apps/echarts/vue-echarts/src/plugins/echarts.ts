import { use } from "echarts/core";

/** 渲染器 */
import { CanvasRenderer } from "echarts/renderers";

/** 图表类型 */
import {
    LineChart,
    BarChart,
    PieChart,
    ScatterChart,
} from "echarts/charts";

/** 组件 */
import {
    TitleComponent,
    TooltipComponent,
    LegendComponent,
    GridComponent,
    DatasetComponent,
    TransformComponent,
    DataZoomComponent,
} from "echarts/components";

/** 注册 */
use([
    CanvasRenderer,

    LineChart,
    BarChart,
    PieChart,
    ScatterChart,

    TitleComponent,
    TooltipComponent,
    LegendComponent,
    GridComponent,
    DatasetComponent,
    TransformComponent,
    DataZoomComponent,
]);
