.class public final La27;
.super Lzw2;
.source "r8-map-id-e0518cc6312f1953c5164e252674cfa64754ff40b09b1c315a60eb336e5a265a"


# static fields
.field private static final zzc:La27;

.field private static volatile zzd:Lvy2;
    .annotation system Ldalvik/annotation/Signature;
        value = {
            "Lvy2;"
        }
    .end annotation
.end field


# instance fields
.field private zze:I

.field private zzf:Ljava/lang/String;

.field private zzg:Le07;


# direct methods
.method static constructor <clinit>()V
    .locals 2

    .line 1
    new-instance v0, La27;

    .line 2
    .line 3
    invoke-direct {v0}, La27;-><init>()V

    .line 4
    .line 5
    .line 6
    sput-object v0, La27;->zzc:La27;

    .line 7
    .line 8
    const-class v1, La27;

    .line 9
    .line 10
    invoke-static {v1, v0}, Lzw2;->l(Ljava/lang/Class;Lzw2;)V

    .line 11
    .line 12
    .line 13
    return-void
.end method

.method public constructor <init>()V
    .locals 1

    .line 1
    invoke-direct {p0}, Lzw2;-><init>()V

    .line 2
    .line 3
    .line 4
    const-string v0, ""

    .line 5
    .line 6
    iput-object v0, p0, La27;->zzf:Ljava/lang/String;

    .line 7
    .line 8
    return-void
.end method

.method public static u(Lgv2;Lpw2;)La27;
    .locals 1

    .line 1
    sget-object v0, La27;->zzc:La27;

    .line 2
    .line 3
    invoke-static {v0, p0, p1}, Lzw2;->h(Lzw2;Lgv2;Lpw2;)Lzw2;

    .line 4
    .line 5
    .line 6
    move-result-object p0

    .line 7
    check-cast p0, La27;

    .line 8
    .line 9
    return-object p0
.end method

.method public static synthetic v(La27;Ljava/lang/String;)V
    .locals 0

    .line 1
    invoke-static {p1}, Ljava/util/Objects;->requireNonNull(Ljava/lang/Object;)Ljava/lang/Object;

    .line 2
    .line 3
    .line 4
    iput-object p1, p0, La27;->zzf:Ljava/lang/String;

    .line 5
    .line 6
    return-void
.end method

.method public static synthetic w(La27;Le07;)V
    .locals 0

    .line 1
    invoke-static {p1}, Ljava/util/Objects;->requireNonNull(Ljava/lang/Object;)Ljava/lang/Object;

    .line 2
    .line 3
    .line 4
    iput-object p1, p0, La27;->zzg:Le07;

    .line 5
    .line 6
    iget p1, p0, La27;->zze:I

    .line 7
    .line 8
    or-int/lit8 p1, p1, 0x1

    .line 9
    .line 10
    iput p1, p0, La27;->zze:I

    .line 11
    .line 12
    return-void
.end method

.method public static x()Lz17;
    .locals 1

    .line 1
    sget-object v0, La27;->zzc:La27;

    .line 2
    .line 3
    invoke-virtual {v0}, Lzw2;->o()Lxw2;

    .line 4
    .line 5
    .line 6
    move-result-object v0

    .line 7
    check-cast v0, Lz17;

    .line 8
    .line 9
    return-object v0
.end method

.method public static y()La27;
    .locals 1

    .line 1
    sget-object v0, La27;->zzc:La27;

    .line 2
    .line 3
    return-object v0
.end method


# virtual methods
.method public final d(I)Ljava/lang/Object;
    .locals 2

    .line 1
    sget-object p0, Ly17;->a:[I

    .line 2
    .line 3
    const/4 v0, 0x1

    .line 4
    sub-int/2addr p1, v0

    .line 5
    aget p0, p0, p1

    .line 6
    .line 7
    packed-switch p0, :pswitch_data_0

    .line 8
    .line 9
    .line 10
    const/4 p0, 0x0

    .line 11
    throw p0

    .line 12
    :pswitch_0
    invoke-static {v0}, Ljava/lang/Byte;->valueOf(B)Ljava/lang/Byte;

    .line 13
    .line 14
    .line 15
    move-result-object p0

    .line 16
    return-object p0

    .line 17
    :pswitch_1
    sget-object p0, La27;->zzd:Lvy2;

    .line 18
    .line 19
    if-nez p0, :cond_1

    .line 20
    .line 21
    const-class p1, La27;

    .line 22
    .line 23
    monitor-enter p1

    .line 24
    :try_start_0
    sget-object p0, La27;->zzd:Lvy2;

    .line 25
    .line 26
    if-nez p0, :cond_0

    .line 27
    .line 28
    new-instance p0, Lyw2;

    .line 29
    .line 30
    invoke-direct {p0}, Ljava/lang/Object;-><init>()V

    .line 31
    .line 32
    .line 33
    sput-object p0, La27;->zzd:Lvy2;

    .line 34
    .line 35
    goto :goto_0

    .line 36
    :catchall_0
    move-exception p0

    .line 37
    goto :goto_1

    .line 38
    :cond_0
    :goto_0
    monitor-exit p1

    .line 39
    return-object p0

    .line 40
    :goto_1
    monitor-exit p1
    :try_end_0
    .catchall {:try_start_0 .. :try_end_0} :catchall_0

    .line 41
    throw p0

    .line 42
    :cond_1
    return-object p0

    .line 43
    :pswitch_2
    sget-object p0, La27;->zzc:La27;

    .line 44
    .line 45
    return-object p0

    .line 46
    :pswitch_3
    const-string p0, "zze"

    .line 47
    .line 48
    const-string p1, "zzf"

    .line 49
    .line 50
    const-string v0, "zzg"

    .line 51
    .line 52
    filled-new-array {p0, p1, v0}, [Ljava/lang/Object;

    .line 53
    .line 54
    .line 55
    move-result-object p0

    .line 56
    const-string p1, "\u0000\u0002\u0000\u0001\u0001\u0002\u0002\u0000\u0000\u0000\u0001\u0208\u0002\u1009\u0000"

    .line 57
    .line 58
    sget-object v0, La27;->zzc:La27;

    .line 59
    .line 60
    new-instance v1, Lbz2;

    .line 61
    .line 62
    invoke-direct {v1, v0, p1, p0}, Lbz2;-><init>(Ltu2;Ljava/lang/String;[Ljava/lang/Object;)V

    .line 63
    .line 64
    .line 65
    return-object v1

    .line 66
    :pswitch_4
    new-instance p0, Lz17;

    .line 67
    .line 68
    sget-object p1, La27;->zzc:La27;

    .line 69
    .line 70
    invoke-direct {p0, p1}, Lxw2;-><init>(Lzw2;)V

    .line 71
    .line 72
    .line 73
    return-object p0

    .line 74
    :pswitch_5
    new-instance p0, La27;

    .line 75
    .line 76
    invoke-direct {p0}, La27;-><init>()V

    .line 77
    .line 78
    .line 79
    return-object p0

    .line 80
    nop

    .line 81
    :pswitch_data_0
    .packed-switch 0x1
        :pswitch_5
        :pswitch_4
        :pswitch_3
        :pswitch_2
        :pswitch_1
        :pswitch_0
    .end packed-switch
.end method

.method public final t()Le07;
    .locals 0

    .line 1
    iget-object p0, p0, La27;->zzg:Le07;

    .line 2
    .line 3
    if-nez p0, :cond_0

    .line 4
    .line 5
    invoke-static {}, Le07;->z()Le07;

    .line 6
    .line 7
    .line 8
    move-result-object p0

    .line 9
    :cond_0
    return-object p0
.end method

.method public final z()Ljava/lang/String;
    .locals 0

    .line 1
    iget-object p0, p0, La27;->zzf:Ljava/lang/String;

    .line 2
    .line 3
    return-object p0
.end method
