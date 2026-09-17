.class public final La10;
.super Ljava/lang/Object;
.source "r8-map-id-e0518cc6312f1953c5164e252674cfa64754ff40b09b1c315a60eb336e5a265a"


# instance fields
.field public final a:Ljava/util/concurrent/atomic/AtomicBoolean;

.field public final synthetic b:Lxa6;


# direct methods
.method public constructor <init>(Lxa6;)V
    .locals 1

    .line 1
    invoke-direct {p0}, Ljava/lang/Object;-><init>()V

    .line 2
    .line 3
    .line 4
    iput-object p1, p0, La10;->b:Lxa6;

    .line 5
    .line 6
    new-instance p1, Ljava/util/concurrent/atomic/AtomicBoolean;

    .line 7
    .line 8
    const/4 v0, 0x0

    .line 9
    invoke-direct {p1, v0}, Ljava/util/concurrent/atomic/AtomicBoolean;-><init>(Z)V

    .line 10
    .line 11
    .line 12
    iput-object p1, p0, La10;->a:Ljava/util/concurrent/atomic/AtomicBoolean;

    .line 13
    .line 14
    return-void
.end method


# virtual methods
.method public final a(Ljava/lang/String;Ljava/lang/String;Ljava/util/LinkedHashMap;)V
    .locals 2

    .line 1
    iget-object v0, p0, La10;->a:Ljava/util/concurrent/atomic/AtomicBoolean;

    .line 2
    .line 3
    invoke-virtual {v0}, Ljava/util/concurrent/atomic/AtomicBoolean;->get()Z

    .line 4
    .line 5
    .line 6
    move-result v0

    .line 7
    if-nez v0, :cond_1

    .line 8
    .line 9
    iget-object v0, p0, La10;->b:Lxa6;

    .line 10
    .line 11
    iget-object v1, v0, Lxa6;->c:Ljava/lang/Object;

    .line 12
    .line 13
    check-cast v1, Ljava/util/concurrent/atomic/AtomicReference;

    .line 14
    .line 15
    invoke-virtual {v1}, Ljava/util/concurrent/atomic/AtomicReference;->get()Ljava/lang/Object;

    .line 16
    .line 17
    .line 18
    move-result-object v1

    .line 19
    if-eq v1, p0, :cond_0

    .line 20
    .line 21
    goto :goto_0

    .line 22
    :cond_0
    iget-object p0, v0, Lxa6;->d:Ljava/lang/Object;

    .line 23
    .line 24
    check-cast p0, Lc10;

    .line 25
    .line 26
    iget-object v0, p0, Lc10;->a:Lfe;

    .line 27
    .line 28
    iget-object v1, p0, Lc10;->b:Ljava/lang/String;

    .line 29
    .line 30
    iget-object p0, p0, Lc10;->c:Lv01;

    .line 31
    .line 32
    invoke-interface {p0, p1, p2, p3}, Lv01;->h(Ljava/lang/String;Ljava/lang/String;Ljava/lang/Object;)Ljava/nio/ByteBuffer;

    .line 33
    .line 34
    .line 35
    move-result-object p0

    .line 36
    invoke-interface {v0, v1, p0}, Lfe;->d(Ljava/lang/String;Ljava/nio/ByteBuffer;)V

    .line 37
    .line 38
    .line 39
    :cond_1
    :goto_0
    return-void
.end method

.method public final b(Ljava/lang/Object;)V
    .locals 2

    .line 1
    iget-object v0, p0, La10;->a:Ljava/util/concurrent/atomic/AtomicBoolean;

    .line 2
    .line 3
    invoke-virtual {v0}, Ljava/util/concurrent/atomic/AtomicBoolean;->get()Z

    .line 4
    .line 5
    .line 6
    move-result v0

    .line 7
    if-nez v0, :cond_1

    .line 8
    .line 9
    iget-object v0, p0, La10;->b:Lxa6;

    .line 10
    .line 11
    iget-object v1, v0, Lxa6;->c:Ljava/lang/Object;

    .line 12
    .line 13
    check-cast v1, Ljava/util/concurrent/atomic/AtomicReference;

    .line 14
    .line 15
    invoke-virtual {v1}, Ljava/util/concurrent/atomic/AtomicReference;->get()Ljava/lang/Object;

    .line 16
    .line 17
    .line 18
    move-result-object v1

    .line 19
    if-eq v1, p0, :cond_0

    .line 20
    .line 21
    goto :goto_0

    .line 22
    :cond_0
    iget-object p0, v0, Lxa6;->d:Ljava/lang/Object;

    .line 23
    .line 24
    check-cast p0, Lc10;

    .line 25
    .line 26
    iget-object v0, p0, Lc10;->a:Lfe;

    .line 27
    .line 28
    iget-object v1, p0, Lc10;->b:Ljava/lang/String;

    .line 29
    .line 30
    iget-object p0, p0, Lc10;->c:Lv01;

    .line 31
    .line 32
    invoke-interface {p0, p1}, Lv01;->e(Ljava/lang/Object;)Ljava/nio/ByteBuffer;

    .line 33
    .line 34
    .line 35
    move-result-object p0

    .line 36
    invoke-interface {v0, v1, p0}, Lfe;->d(Ljava/lang/String;Ljava/nio/ByteBuffer;)V

    .line 37
    .line 38
    .line 39
    :cond_1
    :goto_0
    return-void
.end method
