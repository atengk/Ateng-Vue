import type {PageQuery} from "@/services/http";

export interface UserInfo {
    /** 用户ID */
    id: number

    /** 用户姓名 */
    name: string

    /** 用户年龄 */
    age: number

    /** 分数 */
    score: number

    /** 用户生日，ISO 字符串 */
    birthday: string

    /** 用户所在省份 */
    province: string

    /** 用户所在城市 */
    city: string
}

export interface UserPageQuery extends PageQuery {
    name?: string
    age?: number
}
