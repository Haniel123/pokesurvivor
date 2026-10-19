/* ============ turn-config.js — TURN riêng cho chế độ chơi coop (tuỳ chọn) ============
 * Coop dùng WebRTC P2P. STUN miễn phí của Google đủ cho phần lớn cặp máy, nhưng
 * khi một bên ở NAT đối xứng / wifi công ty / 4G thì KHÔNG nối trực tiếp được.
 * TURN là máy chủ trung chuyển (relay) cho những trường hợp đó.
 *
 * Để trống (null) = tắt TURN, chỉ dùng STUN như trước. Không có lỗi gì.
 * File deploy/coturn/docker-compose.yml dựng TURN trên VPS của bạn (miễn phí
 * license, chỉ tốn băng thông VPS).
 *
 * Điền user/mật khẩu TRÙNG với TURN_USER / TURN_PASS trong Dokploy.
 * Lưu ý: cặp này nằm trong bundle JS công khai (dù đã obfuscate, vẫn đọc được),
 * nên giới hạn tải trong coturn: --quota, --total-quota, --max-bps. Đổi định kỳ.
 */
G.TURN_CONFIG = null;

/* Ví dụ (bỏ comment rồi điền theo server của bạn):
G.TURN_CONFIG = {
  urls: 'turn:turn.pokesurvivor.com:3478',
  username: 'pokesurvivor',
  credential: 'MAT_KHAU_DAI_VA_NGAU_NHIEN'
};
*/

/* Nhiều URL (UDP + TCP) cũng được:
G.TURN_CONFIG = {
  urls: ['turn:turn.pokesurvivor.com:3478?transport=udp', 'turn:turn.pokesurvivor.com:3478?transport=tcp'],
  username: 'pokesurvivor',
  credential: 'MAT_KHAU_DAI_VA_NGAU_NHIEN'
};
*/
