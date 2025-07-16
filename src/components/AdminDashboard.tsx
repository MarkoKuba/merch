import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Plus, Edit, Trash2, Package, Users, Mail, DollarSign } from "lucide-react";
import { ProductForm } from "./ProductForm";

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<"products" | "orders" | "analytics" | "newsletter">("products");
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  
  const isAdmin = useQuery(api.admin.isAdmin);
  const hasAdmin = useQuery(api.admin.hasAdmin);
  const makeFirstUserAdmin = useMutation(api.admin.makeFirstUserAdmin);
  
  const products = useQuery(api.products.listAll);
  const orders = useQuery(api.orders.listAll);
  const analytics = useQuery(api.orders.getAnalytics);
  const newsletterSubscribers = useQuery(api.newsletter.listAll);
  
  const removeProduct = useMutation(api.products.remove);
  const updateOrderStatus = useMutation(api.orders.updateStatus);

  useEffect(() => {
    if (hasAdmin === false) {
      // No admin exists, make current user admin
      makeFirstUserAdmin().catch(() => {
        toast.error("Failed to set up admin access");
      });
    }
  }, [hasAdmin, makeFirstUserAdmin]);

  if (isAdmin === undefined) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600">You don't have admin privileges.</p>
        </div>
      </div>
    );
  }

  const handleDeleteProduct = async (productId: any) => {
    if (confirm("Are you sure you want to delete this product?")) {
      try {
        await removeProduct({ id: productId });
        toast.success("Product deleted successfully");
      } catch (error) {
        toast.error("Failed to delete product");
      }
    }
  };

  const handleStatusUpdate = async (orderId: any, status: string) => {
    try {
      await updateOrderStatus({ orderId, status });
      toast.success("Order status updated");
    } catch (error) {
      toast.error("Failed to update order status");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Admin Dashboard</h1>
        
        {/* Tab Navigation */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: "products", label: "Products", icon: Package },
              { id: "orders", label: "Orders", icon: Users },
              { id: "analytics", label: "Analytics", icon: DollarSign },
              { id: "newsletter", label: "Newsletter", icon: Mail },
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id as any)}
                className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === id
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <Icon size={16} />
                <span>{label}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Products Tab */}
      {activeTab === "products" && (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">Products</h2>
            <button
              onClick={() => setShowProductForm(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <Plus size={16} />
              <span>Add Product</span>
            </button>
          </div>
          
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {products?.map((product) => (
                  <tr key={product._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="h-10 w-10 rounded-md object-cover"
                        />
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {product.name}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {product.category}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${product.price.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        product.isActive
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}>
                        {product.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button
                        onClick={() => {
                          setEditingProduct(product);
                          setShowProductForm(true);
                        }}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(product._id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Orders Tab */}
      {activeTab === "orders" && (
        <div>
          <h2 className="text-2xl font-semibold mb-6">Orders</h2>
          
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {orders?.map((order) => (
                  <tr key={order._id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      #{order._id.slice(-8)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {order.customerName}
                      </div>
                      <div className="text-sm text-gray-500">
                        {order.customerEmail}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${order.totalAmount.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                        className="text-sm border rounded px-2 py-1"
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(order._creationTime).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Analytics Tab */}
      {activeTab === "analytics" && (
        <div>
          <h2 className="text-2xl font-semibold mb-6">Analytics</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Package className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Orders</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {analytics?.totalOrders || 0}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <DollarSign className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    ${analytics?.totalRevenue?.toFixed(2) || "0.00"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Newsletter Tab */}
      {activeTab === "newsletter" && (
        <div>
          <h2 className="text-2xl font-semibold mb-6">Newsletter Subscribers</h2>
          
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Subscribed Date
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {newsletterSubscribers?.map((subscriber) => (
                  <tr key={subscriber._id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {subscriber.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(subscriber.subscribedAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Product Form Modal */}
      {showProductForm && (
        <ProductForm
          product={editingProduct}
          onClose={() => {
            setShowProductForm(false);
            setEditingProduct(null);
          }}
        />
      )}
    </div>
  );
}
