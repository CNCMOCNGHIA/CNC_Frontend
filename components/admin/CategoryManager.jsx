"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { ChevronDown, ChevronRight, Plus, Trash2, X } from "lucide-react";
import { toast } from "sonner";

import {
  getCategories,
  createCategory,
  deleteCategory,
} from "@/services/category";

const idOf = (node) => node?.id ?? node?.categoryId;

const flattenForCount = (nodes) => {
  let count = 0;
  const walk = (list) => {
    for (const n of list || []) {
      count += 1;
      walk(n.children);
    }
  };
  walk(nodes);
  return count;
};

const TreeNode = ({
  node,
  depth,
  expanded,
  onToggle,
  onAddChild,
  onDelete,
  busyId,
}) => {
  const id = idOf(node);
  const hasChildren = (node.children?.length ?? 0) > 0;
  const isExpanded = expanded.has(id);
  const isBusy = busyId === id;

  return (
    <div>
      <div
        className="flex items-center gap-2 py-2 px-3 rounded-md hover:bg-gray-50 border border-transparent hover:border-gray-200"
        style={{ paddingLeft: 12 + depth * 20 }}
      >
        <button
          type="button"
          onClick={() => hasChildren && onToggle(id)}
          className={`p-1 rounded ${
            hasChildren
              ? "text-gray-600 hover:bg-gray-200"
              : "text-transparent cursor-default"
          }`}
          aria-label="toggle"
        >
          {isExpanded ? (
            <ChevronDown size={16} />
          ) : (
            <ChevronRight size={16} />
          )}
        </button>

        <span className="flex-1 text-sm text-gray-900 truncate">
          {node.name}
          {typeof node.level === "number" && (
            <span className="ml-2 text-[10px] uppercase tracking-wide text-gray-400">
              cấp {node.level}
            </span>
          )}
        </span>

        <button
          type="button"
          onClick={() => onAddChild(node)}
          className="text-xs text-blue-600 hover:text-blue-700 px-2 py-1 rounded hover:bg-blue-50 inline-flex items-center gap-1"
          disabled={isBusy}
        >
          <Plus size={14} /> Thêm con
        </button>

        <button
          type="button"
          onClick={() => onDelete(node)}
          className="text-xs text-red-600 hover:text-red-700 px-2 py-1 rounded hover:bg-red-50 inline-flex items-center gap-1 disabled:opacity-50"
          disabled={isBusy}
        >
          <Trash2 size={14} /> Xóa
        </button>
      </div>

      {hasChildren && isExpanded && (
        <div>
          {node.children.map((child) => (
            <TreeNode
              key={idOf(child)}
              node={child}
              depth={depth + 1}
              expanded={expanded}
              onToggle={onToggle}
              onAddChild={onAddChild}
              onDelete={onDelete}
              busyId={busyId}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const CreateForm = ({ parent, onCancel, onSubmit, submitting }) => {
  const [name, setName] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;
    onSubmit(trimmed);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="border border-blue-200 bg-blue-50 rounded-md p-3 mb-4"
    >
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm text-blue-900">
          {parent
            ? `Thêm danh mục con cho “${parent.name}”`
            : "Thêm danh mục gốc"}
        </p>
        <button
          type="button"
          onClick={onCancel}
          className="text-blue-700 hover:text-blue-900"
          aria-label="Đóng"
        >
          <X size={16} />
        </button>
      </div>
      <div className="flex gap-2">
        <input
          autoFocus
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Tên danh mục"
          className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          type="submit"
          disabled={submitting || !name.trim()}
          className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {submitting ? "Đang lưu..." : "Lưu"}
        </button>
      </div>
    </form>
  );
};

const CategoryManager = ({ filterName = "Product", title = "Danh mục sản phẩm" }) => {
  const [tree, setTree] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(new Set());
  const [creatingFor, setCreatingFor] = useState(null);
  const [creatingRoot, setCreatingRoot] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [busyId, setBusyId] = useState(null);

  const load = async () => {
    try {
      setLoading(true);
      const result = await getCategories(filterName);
      const list = Array.isArray(result?.data) ? result.data : [];
      setTree(list);
      const ids = new Set();
      const walk = (nodes) => {
        for (const n of nodes || []) {
          if ((n.children?.length ?? 0) > 0) ids.add(idOf(n));
          walk(n.children);
        }
      };
      walk(list);
      setExpanded(ids);
    } catch (err) {
      console.error("Error loading categories:", err);
      toast.error("Tải danh mục thất bại");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [filterName]);

  const handleToggle = (id) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleAddChild = (parent) => {
    setCreatingRoot(false);
    setCreatingFor(parent);
  };

  const handleAddRoot = () => {
    setCreatingFor(null);
    setCreatingRoot(true);
  };

  const cancelCreate = () => {
    setCreatingFor(null);
    setCreatingRoot(false);
  };

  const handleSubmitCreate = async (name) => {
    try {
      setSubmitting(true);
      const parentId = creatingFor ? idOf(creatingFor) : null;
      await createCategory({ parentId, name });
      toast.success("Tạo danh mục thành công");
      cancelCreate();
      await load();
    } catch (err) {
      console.error("Error creating category:", err);
      const msg =
        err?.response?.data?.messages?.[0] ||
        err?.response?.data?.error?.message ||
        "Tạo danh mục thất bại";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (node) => {
    const id = idOf(node);
    const childCount = flattenForCount(node.children);
    const msg = childCount
      ? `Danh mục “${node.name}” có ${childCount} mục con. Xóa luôn?`
      : `Xóa danh mục “${node.name}”?`;
    if (!window.confirm(msg)) return;
    try {
      setBusyId(id);
      await deleteCategory(id);
      toast.success("Xóa danh mục thành công");
      await load();
    } catch (err) {
      console.error("Error deleting category:", err);
      const m =
        err?.response?.data?.messages?.[0] ||
        err?.response?.data?.error?.message ||
        "Xóa danh mục thất bại";
      toast.error(m);
    } finally {
      setBusyId(null);
    }
  };

  return (
    <motion.div
      className="bg-white shadow-lg rounded-xl p-6 border border-gray-200"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
    >
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-xl font-semibold text-black">{title}</h2>
          <p className="text-sm text-gray-500 mt-0.5">
            Quản lý cây danh mục dùng cho sản phẩm. Có thể tạo nhiều cấp.
          </p>
        </div>
        <button
          type="button"
          onClick={handleAddRoot}
          className="inline-flex items-center gap-1 px-3 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700"
        >
          <Plus size={16} /> Thêm danh mục gốc
        </button>
      </div>

      {creatingRoot && (
        <CreateForm
          parent={null}
          onCancel={cancelCreate}
          onSubmit={handleSubmitCreate}
          submitting={submitting}
        />
      )}

      {creatingFor && (
        <CreateForm
          parent={creatingFor}
          onCancel={cancelCreate}
          onSubmit={handleSubmitCreate}
          submitting={submitting}
        />
      )}

      <div className="border border-gray-200 rounded-md divide-y divide-gray-100 min-h-[120px]">
        {loading ? (
          <div className="p-6 text-center text-sm text-gray-500">
            Đang tải danh mục...
          </div>
        ) : tree.length === 0 ? (
          <div className="p-6 text-center text-sm text-gray-500">
            Chưa có danh mục. Bấm “Thêm danh mục gốc” để tạo mới.
          </div>
        ) : (
          tree.map((node) => (
            <TreeNode
              key={idOf(node)}
              node={node}
              depth={0}
              expanded={expanded}
              onToggle={handleToggle}
              onAddChild={handleAddChild}
              onDelete={handleDelete}
              busyId={busyId}
            />
          ))
        )}
      </div>
    </motion.div>
  );
};

export default CategoryManager;
