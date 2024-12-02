<script lang="ts">
  import { goto } from "$app/navigation";
  import axios from "$lib/axios";
  import { faCheck } from "@fortawesome/free-solid-svg-icons";
  import Fa from "svelte-fa";
  import Swal from "sweetalert2";
  import Cookies from "js-cookie";
  const form = $state({
    email: "",
    password: "",
    confirm_password: "",
    name: "",
    surname: "",
  });
  let loading = $state<boolean>(false);
  const submit = async (
    e: SubmitEvent & { currentTarget: EventTarget & HTMLFormElement },
  ) => {
    e.preventDefault();
    if (form.password !== form.confirm_password) {
      Swal.fire({
        icon: "error",
        title: "รหัสผ่านไม่ตรงกัน",
        text: "กรุณากรอกรหัสผ่านให้ตรงกัน",
        showConfirmButton: false,
        timerProgressBar: true,
        timer: 1500,
      });
      return;
    }
    loading = true;
    await axios
      .post("/auth/register", new URLSearchParams(form).toString(), {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      })
      .then((res) => {
        Swal.fire({
          icon: "success",
          title: "สมัครสมาชิกสำเร็จ",
          text: res.data.msg,
          showConfirmButton: false,
          timer: 1500,
          timerProgressBar: true,
        }).then(() => {
          goto("/auth/login");
        });
      })
      .catch((err) => {
        Swal.fire({
          icon: "error",
          title: "สมัครสมาชิกไม่สำเร็จ",
          text: err.response.data.msg,
          showConfirmButton: false,
          timerProgressBar: true,
          timer: 1500,
        });
      })
      .finally(() => {
        loading = false;
      });
  };
</script>

<div class="w-full">
  <div class="h-screen flex justify-items-center items-center justify-center">
    <div class="w-2/6">
      <div class="shadow p-3 bg-white w-full">
        <div>
          <p class="text-xl font-bold text-center">สมัครสมาชิก : Registers</p>
        </div>
        <form onsubmit={submit} class="mt-3 flex-col flex gap-4">
          <div class="flex gap-2">
            <label class="form-control w-full">
              <div class="label">
                <span class="label-text">ชื่อจริง: </span>
              </div>
              <input
                bind:value={form.name}
                name="name"
                type="text"
                placeholder="กรอกชื่อจริง..."
                class="input input-bordered w-full"
              />
            </label>
            <label class="form-control w-full">
              <div class="label">
                <span class="label-text">นามสกุล: </span>
              </div>
              <input
                bind:value={form.surname}
                name="surname"
                type="text"
                placeholder="กรอกนามสกุล..."
                class="input input-bordered w-full"
              />
            </label>
          </div>
          <div>
            <label class="form-control w-full">
              <div class="label">
                <span class="label-text">อีเมล: </span>
              </div>
              <input
                bind:value={form.email}
                name="email"
                type="text"
                placeholder="กรอกอีเมลของท่าน..."
                class="input input-bordered w-full"
              />
            </label>
          </div>
          <div class="flex gap-2">
            <label class="form-control w-full">
              <div class="label">
                <span class="label-text">รหัสผ่าน: </span>
              </div>
              <input
                bind:value={form.password}
                name="password"
                type="password"
                placeholder="กรอกรหัสผ่านของท่าน..."
                class="input input-bordered w-full"
              />
            </label>
            <label class="form-control w-full">
              <div class="label">
                <span class="label-text">ยืนยันรหัสผ่าน: </span>
              </div>
              <input
                bind:value={form.confirm_password}
                name="confirm_password"
                type="password"
                placeholder="กรอกยืนยันรหัสผ่านของท่าน..."
                class="input input-bordered w-full"
              />
            </label>
          </div>
          <div class="w-full">
            <div class="text-right">
              <a class="text-[12px] text-blue-600" href="/"
                >มีบัญชีแล้ว? เข้าสู่ระบบเลย!!</a
              >
            </div>
            <button
              type="submit"
              class="btn btn-outline btn-accent w-full hover:text-white"
            >
              {#if loading}
                <span class="loading loading-spinner loading-xs"></span>
              {:else}
                <div class="flex gap-2">
                  <Fa icon={faCheck} />
                  <p>ยืนยันการสมัครสมาชิก</p>
                </div>
              {/if}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</div>
