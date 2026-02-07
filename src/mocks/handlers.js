import { http, HttpResponse } from "msw";

const API_URL = "http://localhost:8080";

export const handlers = [
  http.post(`${API_URL}/api/users/registration`, async ({ request }) => {
    const body = await request.json();

    console.log("Mock: Registration request", body);

    return HttpResponse.json({
      message: "Registration successful. Check email for verification code.",
      email: body.email,
    });
  }),

  http.post(`${API_URL}/api/users/confirm-registration`, ({ request }) => {
    const url = new URL(request.url);
    const code = url.searchParams.get("code");

    console.log("Mock: Verification code:", code);

    if (code && code.length === 6) {
      console.log("✅ Код принят");
      return HttpResponse.json("Аккаунт успешно подтверждён");
    }

    console.log("❌ Код отклонен");
    return HttpResponse.json(
      { message: "Неверный код регистрации!" },
      { status: 400 },
    );
  }),

  http.post(`${API_URL}/api/users/resend-confirm-registration`, () => {
    console.log("Mock: Resend code");
    return HttpResponse.json("Повторно отправлен код для регистрации");
  }),

  http.post(`${API_URL}/auth/sign-in`, async ({ request }) => {
    const body = await request.json();

    console.log("Mock: Login request", body);

    return HttpResponse.json({
      accessToken: "mock-access-token-123",
      refreshToken: "mock-refresh-token-456",
      user: {
        id: 1,
        firstName: "John",
        lastName: "Doe",
        email: body.email,
        avatar: null,
        bio: "Cyberpunk enthusiast",
        location: "Neo Tokyo",
        website: null,
        joinedAt: new Date().toISOString(),
      },
    });
  }),

  http.get(`${API_URL}/api/users/me`, ({ request }) => {
    const token = request.headers.get("Authorization");

    console.log("Mock: Get current user", token);

    if (!token) {
      return HttpResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    return HttpResponse.json({
      id: 1,
      firstName: "John",
      lastName: "Doe",
      email: "john@example.com",
      avatar: null,
      bio: "Cyberpunk enthusiast",
      location: "Neo Tokyo",
      website: null,
      joinedAt: new Date().toISOString(),
    });
  }),

  http.post(`${API_URL}/auth/refresh`, async () => {
    console.log("Mock: Refresh token");

    return HttpResponse.json({
      accessToken: "new-mock-access-token",
      refreshToken: "new-mock-refresh-token",
    });
  }),

  http.put(`${API_URL}/api/users/:userId`, async ({ request, params }) => {
    const body = await request.json();

    console.log("Mock: Update profile", params.userId, body);

    return HttpResponse.json({
      id: Number(params.userId),
      firstName: body.firstName || "John",
      lastName: body.lastName || "Doe",
      email: "john@example.com",
      avatar: null,
      bio: body.bio || null,
      location: body.location || null,
      website: body.website || null,
      updatedAt: new Date().toISOString(),
    });
  }),

  http.post(
    `${API_URL}/api/users/addAvatar/:userId/newAvatar`,
    ({ params }) => {
      console.log("Mock: Upload avatar for user", params.userId);

      return HttpResponse.json("Аватарка успешно добавлена");
    },
  ),

  http.get(`${API_URL}/api/posts/user/:userId`, ({ params }) => {
    console.log("Mock: Get user posts", params.userId);

    return HttpResponse.json([
      {
        id: 1,
        content: "First post in the network",
        images: [],
        author: {
          id: Number(params.userId),
          firstName: "John",
          lastName: "Doe",
          avatar: null,
        },
        likeCount: 5,
        commentCount: 2,
        isLiked: false,
        createdAt: new Date().toISOString(),
      },
    ]);
  }),

  http.post(`${API_URL}/api/users/send-password-resetCode`, ({ request }) => {
    const url = new URL(request.url);
    const email = url.searchParams.get("email");

    console.log("Mock: Send password reset code to", email);

    return HttpResponse.json("Код для сброса пароля отправлен на почту.");
  }),

  http.post(`${API_URL}/api/users/reset-password-with-code`, ({ request }) => {
    const url = new URL(request.url);
    const email = url.searchParams.get("email");
    const code = url.searchParams.get("code");

    console.log("Mock: Reset password for", email, "with code", code);

    return HttpResponse.json("Пароль успешно изменён");
  }),
];
