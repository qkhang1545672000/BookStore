import Room from "../models/Room.js";
import Tenant from "../models/Tenant.js";
export const createRoom = async (req, res) => {
  try {
    const { roomCode, floor, status, price, note, isActive } = req.body;
    const room = new Room({ roomCode, floor, status, price, note, isActive });
    const newRoom = await room.save();

    res.status(201).json(newRoom);
  } catch (error) {
    console.error("lỗi khi gọi createTask", error);
    res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

export const getRoom = async (req, res) => {
  try {
    const result = await Room.aggregate([
      {
        $facet: {
          // ===== DANH SÁCH =====
          all: [{ $sort: { createdAt: -1 } }],

          empty: [{ $match: { status: "empty" } }],
          occupied: [{ $match: { status: "occupied" } }],
          late: [{ $match: { status: "late" } }],
          maintenance: [{ $match: { status: "maintenance" } }],

          // ===== COUNT =====
          countAll: [{ $count: "total" }],

          countEmpty: [{ $match: { status: "empty" } }, { $count: "total" }],

          countOccupied: [{ $match: { status: "occupied" } }, { $count: "total" }],

          countLate: [{ $match: { status: "late" } }, { $count: "total" }],

          countMaintenance: [{ $match: { status: "maintenance" } }, { $count: "total" }],
        },
      },
    ]);

    const data = result[0];

    res.status(200).json({
      rooms: {
        all: data.all,
        empty: data.empty,
        occupied: data.occupied,
        late: data.late,
        maintenance: data.maintenance,
      },
      count: {
        all: data.countAll?.[0]?.total || 0,
        empty: data.countEmpty?.[0]?.total || 0,
        occupied: data.countOccupied?.[0]?.total || 0,
        late: data.countLate?.[0]?.total || 0,
        maintenance: data.countMaintenance?.[0]?.total || 0,
      },
    });
  } catch (error) {
    console.error("Lỗi khi lấy phòng", error);
    res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

export const deleteRoom = async (req, res) => {
  try {
    const { id } = req.params;
    const roomDelete = await Room.findByIdAndDelete(id);
    if (!roomDelete) {
      return res.status(404).json({ message: "Không tìm thấy phòng" });
    }
    res.status(201).json(roomDelete);
  } catch (error) {
    console.error("lỗi khi gọi DeleteRoom", error);
    res.status(500).json({ message: "Lỗi hệ thống" });
  }
};
export const UpdateRoom = async (req, res) => {
  try {
    const { id } = req.params;
    const { roomCode, floor, price, status, note } = req.body;

    // 1️⃣ Kiểm tra phòng tồn tại
    const room = await Room.findById(id);
    if (!room) {
      return res.status(404).json({ message: "Phòng không tồn tại" });
    }

    // 2️⃣ Đếm số tenant trong phòng
    const tenantCount = await Tenant.countDocuments({ room: id });
    const hasTenant = tenantCount > 0;

    // 3️⃣ Kiểm tra nghiệp vụ
    // TH2: Có người → không cho set trống
    if (status === "empty" && hasTenant) {
      return res.status(400).json({
        message: "Phòng đang có người thuê, không thể cập nhật trạng thái trống",
      });
    }

    // 4️⃣ Update
    room.roomCode = roomCode ?? room.roomCode;
    room.floor = floor ?? room.floor;
    room.price = price ?? room.price;
    room.status = status ?? room.status;
    room.note = note ?? room.note;

    await room.save();

    res.status(200).json({
      message: "Cập nhật phòng thành công",
      data: room,
    });
  } catch (error) {
    console.error("Lỗi UpdateRoom:", error);
    res.status(500).json({ message: "Lỗi hệ thống UpdateRoom" });
  }
};
