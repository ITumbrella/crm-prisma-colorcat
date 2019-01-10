import { prisma } from '../generated/prisma-client';

const coreDictionary = [
  "个人属性",
  "回访字典",
  "市场合作机构",
  "收费字典",
  "广告类别和计划", // 5
  "手术状态和疗程状态",
  "项目字典",
  "客户标签",
  "咨询方式",
  "咨询结果", // 10
  "客户VIP等级",
  "来院类别",
  "区域",
  "主来源",
  "收费项目" // 15
];

/** 个人属性一级 */
const personalPropDics = [
  "婚姻状况",
  "手机型号",
  "教育背景",
  "职业",
  "汽车型号",
  "客户VIP等级"
];

/** 市场合作机构一级 */
const agencyDics = ["机构类别", "机构级别", "合作状态"];
/** 回访字典一级 */
const tracebackDics = [
  "回访结果",
  "客户流向",
  "回访状态",
  "回访主题",
  "回访类型",
  "回访方式"
];

async function importDictionaryCore() {
  await prisma.deleteManyDictionaries();
  console.log("删除所有字典");

  for (let i = 1; i < coreDictionary.length + 1; i += 1) {
    const core = coreDictionary[i];
    await prisma.createDictionary({
      itemName: core,
      rootIndex: -i,
      itemAvailiable: true
    });
  }
  const coreDics = await prisma.dictionaries();
  const traceback = coreDics.find(ele => ele.rootIndex === -2);
  for (let i = 0; i < tracebackDics.length; i += 1) {
    await prisma.createDictionary({
      itemName: tracebackDics[i],
      rootIndex: i + 100,
      sortIndex: i + 100,
      itemParentId: traceback.id,
      itemAvailiable: true
    });
  }

  const agency = coreDics.find(ele => ele.rootIndex === -3);
  for (let i = 0; i < agencyDics.length; i += 1) {
    await prisma.createDictionary({
      itemName: agencyDics[i],
      rootIndex: i + 200,
      sortIndex: i + 200,
      itemParentId: agency.id,
      itemAvailiable: true
    });
  }
}
importDictionaryCore();
