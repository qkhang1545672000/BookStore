import Room from "../models/Room.js";
import Tenant from "../models/Tenant.js";
import bcrypt from "bcrypt";

export const createTenant = async (req, res) => {
  try {
    const { name, password, phone, cccd, address, room, sex } = req.body;

    if (!name || !password || !phone || !cccd || !address || !room || !sex) {
      return res.status(400).json({
        message: "Không thể thiếu name, password, phone, cccd,address và room",
      });
    }
    const Myroom = await Room.findById(room); // room phòng mà tenant ở
    if (!Myroom) {
      return res.status(404).json({ message: "Phòng không tồn tại" });
    }

    // 2️⃣ Không cho thêm nếu phòng đang bảo trì
    if (Myroom.status === "maintenance") {
      return res.status(400).json({
        message: "Phòng đang bảo trì, không thể thêm người",
      });
    }
    // kiểm tra username tồn tại chưa
    const duplicate = await Tenant.findOne({ name });
    if (duplicate) {
      return res.status(409).json({ message: "name đã tồn tại" });
    }
    const hashedPassword = await bcrypt.hash(password, 10); // salt = 10
    const tenant = new Tenant({
      name,
      sex,
      password: hashedPassword,
      phone,
      cccd,
      address,
      room,
    });
    const newTenant = await tenant.save();
    // 4️⃣ CẬP NHẬT PHÒNG → ĐANG THUÊ
    Myroom.status = "occupied";
    await Myroom.save();

    res.status(201).json({
      message: "Thêm người thuê thành công",
      newTenant,
    });
  } catch (error) {
    console.error("lỗi khi gọi createTenant", error);
    res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

export const getTenant = async (req, res) => {
  try {
    const tenant = await Tenant.find().populate("room", "roomCode");

    res.status(201).json(tenant);
  } catch (error) {
    console.error("lỗi khi gọi getTenant", error);
    res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

export const deleteTenant = async (req, res) => {
  try {
    const { id } = req.params;
    const tenantDelete = await Tenant.findByIdAndDelete(id);
    if (!tenantDelete) {
      return res.status(404).json({ message: "Không tìm thấy phòng" });
    }
    res.status(201).json(tenantDelete);
  } catch (error) {
    console.error("lỗi khi gọi tenantDelete", error);
    res.status(500).json({ message: "Lỗi hệ thống" });
  }
};
export const UpdateTenant = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, password, phone, cccd, address, room } = req.body;

    const tenantUpdate = await Tenant.findByIdAndUpdate(
      id,
      { name, password, phone, cccd, address, room },
      { new: true },
    );
    if (!tenantUpdate) {
      return res.status(404).json({ message: "Không cập nhật được" });
    }
    res.status(201).json(roomUpdate);
  } catch (error) {
    console.error("lỗi khi gọi tenantUpdate", error);
    res.status(500).json({ message: "Lỗi hệ thống" });
  }
};
export const UpdateTenantsRoom = async (req, res) => {
  try {
    const { tenantIds, room } = req.body;

    if (!tenantIds?.length || !room) {
      return res.status(400).json({
        message: "Thiếu tenantIds hoặc room",
      });
    }

    const result = await Tenant.updateMany(
      { _id: { $in: tenantIds } },
      {
        $set: { room },
      },
    );

    if (result.modifiedCount === 0) {
      return res.status(404).json({
        message: "Không có người thuê nào được cập nhật",
      });
    }

    res.status(200).json({
      message: "Cập nhật phòng cho người thuê thành công",
      updatedCount: result.modifiedCount,
    });
  } catch (error) {
    console.error("Lỗi khi update nhiều tenant", error);
    res.status(500).json({ message: "Lỗi hệ thống" });
  }
};
