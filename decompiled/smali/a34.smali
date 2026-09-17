.class public final La34;
.super Ljava/lang/Object;
.source "r8-map-id-e0518cc6312f1953c5164e252674cfa64754ff40b09b1c315a60eb336e5a265a"

# interfaces
.implements Luc3;


# instance fields
.field public final I:Lx24;

.field public a:Lqy3;

.field public final b:Ljava/util/concurrent/Executor;

.field public final c:Lv24;

.field public final d:Lwu;

.field public e:Z

.field public f:Z


# direct methods
.method public constructor <init>(Ljava/util/concurrent/Executor;Lv24;Lwu;)V
    .locals 1

    .line 1
    invoke-direct {p0}, Ljava/lang/Object;-><init>()V

    .line 2
    .line 3
    .line 4
    const/4 v0, 0x0

    .line 5
    iput-boolean v0, p0, La34;->e:Z

    .line 6
    .line 7
    iput-boolean v0, p0, La34;->f:Z

    .line 8
    .line 9
    new-instance v0, Lx24;

    .line 10
    .line 11
    invoke-direct {v0}, Lx24;-><init>()V

    .line 12
    .line 13
    .line 14
    iput-object v0, p0, La34;->I:Lx24;

    .line 15
    .line 16
    iput-object p1, p0, La34;->b:Ljava/util/concurrent/Executor;

    .line 17
    .line 18
    iput-object p2, p0, La34;->c:Lv24;

    .line 19
    .line 20
    iput-object p3, p0, La34;->d:Lwu;

    .line 21
    .line 22
    return-void
.end method


# virtual methods
.method public final E0(Ltc3;)V
    .locals 4

    .line 1
    iget-boolean v0, p0, La34;->f:Z

    .line 2
    .line 3
    if-eqz v0, :cond_0

    .line 4
    .line 5
    const/4 v0, 0x0

    .line 6
    goto :goto_0

    .line 7
    :cond_0
    iget-boolean v0, p1, Ltc3;->j:Z

    .line 8
    .line 9
    :goto_0
    iget-object v1, p0, La34;->I:Lx24;

    .line 10
    .line 11
    iput-boolean v0, v1, Lx24;->a:Z

    .line 12
    .line 13
    iget-object v0, p0, La34;->d:Lwu;

    .line 14
    .line 15
    invoke-virtual {v0}, Ljava/lang/Object;->getClass()Ljava/lang/Class;

    .line 16
    .line 17
    .line 18
    invoke-static {}, Landroid/os/SystemClock;->elapsedRealtime()J

    .line 19
    .line 20
    .line 21
    move-result-wide v2

    .line 22
    iput-wide v2, v1, Lx24;->c:J

    .line 23
    .line 24
    iput-object p1, v1, Lx24;->e:Ltc3;

    .line 25
    .line 26
    iget-boolean p1, p0, La34;->e:Z

    .line 27
    .line 28
    if-eqz p1, :cond_1

    .line 29
    .line 30
    invoke-virtual {p0}, La34;->b()V

    .line 31
    .line 32
    .line 33
    :cond_1
    return-void
.end method

.method public final b()V
    .locals 4

    .line 1
    :try_start_0
    iget-object v0, p0, La34;->c:Lv24;

    .line 2
    .line 3
    iget-object v1, p0, La34;->I:Lx24;

    .line 4
    .line 5
    invoke-virtual {v0, v1}, Lv24;->a(Lx24;)Lorg/json/JSONObject;

    .line 6
    .line 7
    .line 8
    move-result-object v0

    .line 9
    iget-object v1, p0, La34;->a:Lqy3;

    .line 10
    .line 11
    if-eqz v1, :cond_0

    .line 12
    .line 13
    iget-object v1, p0, La34;->b:Ljava/util/concurrent/Executor;

    .line 14
    .line 15
    new-instance v2, Ldz3;

    .line 16
    .line 17
    const/4 v3, 0x4

    .line 18
    invoke-direct {v2, v3, p0, v0}, Ldz3;-><init>(ILjava/lang/Object;Ljava/lang/Object;)V

    .line 19
    .line 20
    .line 21
    invoke-interface {v1, v2}, Ljava/util/concurrent/Executor;->execute(Ljava/lang/Runnable;)V
    :try_end_0
    .catch Lorg/json/JSONException; {:try_start_0 .. :try_end_0} :catch_0

    .line 22
    .line 23
    .line 24
    :cond_0
    return-void

    .line 25
    :catch_0
    move-exception p0

    .line 26
    const-string v0, "Failed to call video active view js"

    .line 27
    .line 28
    invoke-static {v0, p0}, Lkh4;->b(Ljava/lang/String;Ljava/lang/Throwable;)V

    .line 29
    .line 30
    .line 31
    return-void
.end method
