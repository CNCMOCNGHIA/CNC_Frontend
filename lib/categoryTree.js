// Convert flat category list từ BE (mỗi item có { id, parentId, name, level, type, childrenIds })
// thành nested tree với .children populated. Trả về roots (parentId = null).
//
// Mỗi node giữ cả `id` và alias `categoryId` để legacy callsite không cần đổi.
export const buildCategoryTree = (flatList) => {
  if (!Array.isArray(flatList)) return [];

  const byId = new Map();
  for (const item of flatList) {
    if (!item?.id) continue;
    byId.set(item.id, { ...item, categoryId: item.id, children: [] });
  }

  const roots = [];
  for (const node of byId.values()) {
    if (node.parentId && byId.has(node.parentId)) {
      byId.get(node.parentId).children.push(node);
    } else {
      roots.push(node);
    }
  }

  return roots;
};
