<script lang="ts">
    import { faCheck } from "@fortawesome/free-solid-svg-icons";
    import Fa from "svelte-fa";
    import Cookies from "js-cookie";
    import axios from "$lib/axios";
    import Swal from "sweetalert2";
    import { goto } from "$app/navigation";
    const form = $state({
        email: "",
        password: "",
    })
    let loading = $state<boolean>(false);
    const submit = async (
        e: SubmitEvent & {
            currentTarget: EventTarget & HTMLFormElement;
        },
    ) => {
        e.preventDefault();
        loading = true;
        await axios
            .post(
                "/auth/login",new URLSearchParams(form),
                {
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                    },
                },
            )
            .then((res) => {
                Cookies.set("token", res.data.data.token);
                Swal.fire({
                    icon: "success",
                    title: "เข้าสู่ระบบสำเร็จ",
                    text: "กำลังเปลี่ยนหน้า...",
                    showConfirmButton: false,
                    timer: 1500,
                    timerProgressBar: true,
                }).then(() => {
                    goto("/");
                }); 
            })
            .catch((err) => {
                Swal.fire({
                    icon: "error",
                    title: "เข้าสู่ระบบไม่สำเร็จ",
                    text: err.response.data.msg,
                    showConfirmButton: false,
                    timerProgressBar: true,
                    timer: 1500,
                });
            }).finally(() => {
                loading = false;
            });
    };
</script>

<div class="w-full">
    <div class="h-screen flex justify-items-center items-center justify-center">
        <div class="w-2/6">
            <div class="shadow p-3 bg-white w-full">
                <div>
                    <p class="text-xl font-bold text-center">
                        เข้าสู่ระบบ : Login
                    </p>
                </div>
                <form
                    onsubmit={submit}
                    class="mt-3 flex-col flex gap-4"
                >
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
                    <div>
                        <label class="form-control w-full">
                            <div class="label">
                                <span class="label-text"
                                    >รหัสผ่านของท่าน:
                                </span>
                            </div>
                            <input
                                bind:value={form.password}
                                name="password"
                                type="password"
                                placeholder="กรอกอีเมลของท่าน..."
                                class="input input-bordered w-full"
                            />
                        </label>
                    </div>
                    <div class="w-full">
                        <div class="text-right">
                            <a
                                class="text-[12px] text-blue-600"
                                href="/auth/register"
                                >ยังไม่มีบัญชีใช่หรือไม่? สมัครสมาชิกสิ!</a
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
                                <p>ยืนยันการเข้าสู่ระบบ</p>
                            </div>
                        {/if}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>
