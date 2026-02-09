import { http, HttpResponse } from "msw";

// const API_URL = "http://localhost:8080";

export const handlers = [
  // Логин
  http.post("*/auth/sign-in", async ({ request }) => {
    const body = await request.json();
    console.log("🟢 MSW: Login request", body);
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

  // Регистрация
  http.post("*/api/users/registration", async ({ request }) => {
    const body = await request.json();
    console.log("🟢 MSW: Registration request", body);
    return HttpResponse.json({
      message: "Registration successful. Check email for verification code.",
      email: body.email,
    });
  }),

  // Подтверждение регистрации
  http.post("*/api/users/confirm-registration", ({ request }) => {
    const url = new URL(request.url);
    const code = url.searchParams.get("code");
    console.log("🟢 MSW: Verification code:", code);
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

  // Повторная отправка кода
  http.post("*/api/users/resend-confirm-registration", () => {
    console.log("🟢 MSW: Resend code");
    return HttpResponse.json("Повторно отправлен код для регистрации");
  }),

  // Получить текущего юзера
  http.get("*/api/users/me", ({ request }) => {
    const token = request.headers.get("Authorization");
    console.log("🟢 MSW: Get current user", token);
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

  // Обновление токена
  http.post("*/auth/refresh", async () => {
    console.log("🟢 MSW: Refresh token");
    return HttpResponse.json({
      accessToken: "new-mock-access-token",
      refreshToken: "new-mock-refresh-token",
    });
  }),

  // Обновление профиля
  http.put("*/api/users/:userId", async ({ request, params }) => {
    const body = await request.json();
    console.log("🟢 MSW: Update profile", params.userId, body);
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

  // Загрузка аватара
  http.post("*/api/users/addAvatar/:userId/newAvatar", ({ params }) => {
    console.log("🟢 MSW: Upload avatar for user", params.userId);
    return HttpResponse.json("Аватарка успешно добавлена");
  }),

  // Посты пользователя
  http.get("*/api/posts/user/:userId", ({ params }) => {
    console.log("🟢 MSW: Get user posts", params.userId);
    return HttpResponse.json([
      {
        id: 1,
        content: "Just finished building my new cyberpunk social network! 🚀 The neon aesthetic is fire. What do you all think?",
        images: ["https://picsum.photos/600/400?random=10"],
        author: {
          id: Number(params.userId),
          firstName: "John",
          lastName: "Doe",
          avatar: null,
        },
        likeCount: 42,
        commentCount: 2,
        repostCount: 12,
        isLiked: false,
        isReposted: false,
        createdAt: new Date(Date.now() - 7200000).toISOString(),
        comments: [
          {
            id: 101,
            content: "This looks amazing! Love the design choices 🎨",
            author: {
              id: 2,
              firstName: "Sarah",
              lastName: "Connor",
              avatar: "https://i.pravatar.cc/150?img=5",
            },
            createdAt: new Date(Date.now() - 3600000).toISOString(),
          },
          {
            id: 102,
            content: "The animations are so smooth! How did you do that?",
            author: {
              id: 3,
              firstName: "Neo",
              lastName: "Anderson",
              avatar: "https://i.pravatar.cc/150?img=8",
            },
            createdAt: new Date(Date.now() - 1800000).toISOString(),
            editedAt: new Date(Date.now() - 900000).toISOString(),
          },
        ],
      },
      {
        id: 2,
        content: "Exploring the digital frontier. The future is now, and it's beautifully chaotic. 💜✨",
        images: [],
        author: {
          id: Number(params.userId),
          firstName: "John",
          lastName: "Doe",
          avatar: null,
        },
        likeCount: 28,
        commentCount: 5,
        repostCount: 6,
        isLiked: true,
        isReposted: false,
        createdAt: new Date(Date.now() - 14400000).toISOString(),
      },
      {
        id: 3,
        content: "Code, coffee, and neon lights. That's the recipe for a productive day in Neo Tokyo. ☕💻",
        images: ["https://picsum.photos/600/400?random=11"],
        author: {
          id: Number(params.userId),
          firstName: "John",
          lastName: "Doe",
          avatar: null,
        },
        likeCount: 15,
        commentCount: 3,
        repostCount: 4,
        isLiked: false,
        isReposted: true,
        createdAt: new Date(Date.now() - 86400000).toISOString(),
      },
      {
        id: 4,
        content: "React Class Components are making a comeback! Who needs hooks when you have the power of inheritance? 😎",
        images: [],
        author: {
          id: Number(params.userId),
          firstName: "John",
          lastName: "Doe",
          avatar: null,
        },
        likeCount: 67,
        commentCount: 15,
        repostCount: 23,
        isLiked: true,
        isReposted: false,
        createdAt: new Date(Date.now() - 172800000).toISOString(),
      },
      {
        id: 5,
        content: "The city never sleeps, and neither do I. Time to push some code and break some boundaries. 🌃",
        images: ["https://picsum.photos/600/400?random=12", "https://picsum.photos/600/400?random=13"],
        author: {
          id: Number(params.userId),
          firstName: "John",
          lastName: "Doe",
          avatar: null,
        },
        likeCount: 91,
        commentCount: 12,
        repostCount: 18,
        isLiked: false,
        isReposted: false,
        createdAt: new Date(Date.now() - 259200000).toISOString(),
      },
    ]);
  }),

  // Сброс пароля - отправка кода
  http.post("*/api/users/send-password-resetCode", ({ request }) => {
    const url = new URL(request.url);
    const email = url.searchParams.get("email");
    console.log("🟢 MSW: Send password reset code to", email);
    return HttpResponse.json("Код для сброса пароля отправлен на почту.");
  }),

  // Сброс пароля с кодом
  http.post("*/api/users/reset-password-with-code", ({ request }) => {
    const url = new URL(request.url);
    const email = url.searchParams.get("email");
    const code = url.searchParams.get("code");
    console.log("🟢 MSW: Reset password for", email, "with code", code);
    return HttpResponse.json("Пароль успешно изменён");
  }),

  // Профиль по ID
  http.get("*/api/profile/my-profile/:id", ({ params }) => {
    console.log("🟢 MSW: Get profile by ID", params.id);
    return HttpResponse.json({
      id: Number(params.id),
      firstName: "Offline",
      lastName: "Mode",
      bio: "MSW работает! 🎭",
      avatar: null,
      location: "Localhost",
    });
  }),

  // Поиск профиля по email
  http.get("*/api/profile/findProfile", ({ request }) => {
    const url = new URL(request.url);
    const email = url.searchParams.get("email");
    console.log("🟢 MSW: Find profile by email", email);
    return HttpResponse.json({
      id: 1,
      firstName: "Found",
      lastName: "User",
      email: email,
      bio: "Найден через MSW",
    });
  }),

  // Получить список диалогов
  http.get("*/api/messages/conversations", () => {
    console.log("🟢 MSW: Get conversations");
    return HttpResponse.json([
      {
        id: 1,
        participant: {
          id: 2,
          firstName: "Sarah",
          lastName: "Connor",
          avatar: "https://i.pravatar.cc/150?img=5",
          isOnline: true,
        },
        lastMessage: {
          id: 101,
          content: "Hey! How's the social network project going?",
          senderId: 2,
          createdAt: new Date(Date.now() - 300000).toISOString(),
        },
        unreadCount: 2,
      },
      {
        id: 2,
        participant: {
          id: 3,
          firstName: "Neo",
          lastName: "Anderson",
          avatar: "https://i.pravatar.cc/150?img=8",
          isOnline: true,
        },
        lastMessage: {
          id: 102,
          content: "The Matrix has you...",
          senderId: 1,
          createdAt: new Date(Date.now() - 3600000).toISOString(),
        },
        unreadCount: 0,
      },
      {
        id: 3,
        participant: {
          id: 4,
          firstName: "Trinity",
          lastName: "Matrix",
          avatar: "https://i.pravatar.cc/150?img=9",
          isOnline: false,
        },
        lastMessage: {
          id: 103,
          content: "Follow the white rabbit",
          senderId: 4,
          createdAt: new Date(Date.now() - 86400000).toISOString(),
        },
        unreadCount: 0,
      },
    ]);
  }),

  // Получить сообщения в диалоге
  http.get("*/api/messages/:conversationId", ({ params }) => {
    console.log("🟢 MSW: Get messages for conversation", params.conversationId);
    const conversationId = Number(params.conversationId);
    
    const messages = [
      {
        id: 1,
        content: "Hey there! 👋",
        senderId: 2,
        sender: {
          id: 2,
          firstName: "Sarah",
          lastName: "Connor",
        },
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        isRead: true,
      },
      {
        id: 2,
        content: "Hi! How are you doing?",
        senderId: 1,
        sender: {
          id: 1,
          firstName: "John",
          lastName: "Doe",
        },
        createdAt: new Date(Date.now() - 82800000).toISOString(),
        isRead: true,
      },
      {
        id: 3,
        content: "Pretty good! Working on the cyberpunk social network. You?",
        senderId: 2,
        sender: {
          id: 2,
          firstName: "Sarah",
          lastName: "Connor",
        },
        createdAt: new Date(Date.now() - 79200000).toISOString(),
        isRead: true,
      },
      {
        id: 4,
        content: "That sounds amazing! Love the neon aesthetic 💜",
        senderId: 1,
        sender: {
          id: 1,
          firstName: "John",
          lastName: "Doe",
        },
        createdAt: new Date(Date.now() - 3600000).toISOString(),
        isRead: true,
      },
      {
        id: 5,
        content: "Thanks! The direct messaging feature is coming together nicely",
        senderId: 2,
        sender: {
          id: 2,
          firstName: "Sarah",
          lastName: "Connor",
        },
        createdAt: new Date(Date.now() - 1800000).toISOString(),
        isRead: true,
      },
      {
        id: 6,
        content: "Hey! How's the social network project going?",
        senderId: 2,
        sender: {
          id: 2,
          firstName: "Sarah",
          lastName: "Connor",
        },
        createdAt: new Date(Date.now() - 300000).toISOString(),
        isRead: false,
      },
    ];

    return HttpResponse.json(messages);
  }),

  // Отправить сообщение
  http.post("*/api/messages/:conversationId", async ({ params, request }) => {
    const body = await request.json();
    console.log("🟢 MSW: Send message to conversation", params.conversationId, body);
    return HttpResponse.json({
      id: Date.now(),
      content: body.content,
      senderId: 1,
      createdAt: new Date().toISOString(),
      isRead: false,
    });
  }),

  // Отметить сообщения как прочитанные
  http.put("*/api/messages/:conversationId/read", ({ params }) => {
    console.log("🟢 MSW: Mark conversation as read", params.conversationId);
    return HttpResponse.json({ success: true });
  }),
];
